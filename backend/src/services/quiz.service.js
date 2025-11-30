import mongoose from "mongoose";
import Technique from "../models/theory.model.js";
import Quiz from "../models/quiz.model.js";
import WrongNote from "../models/wrongNode.model.js";
import QuizProcess from "../models/quizProcess.model.js";
import dotenv from "dotenv";
dotenv.config();
import { analyzeAnswersBatch } from "../utils/ai.client.js";

let UserModel = null;

try {
        const mod = await import("../models/user.model.js");
        UserModel = mod.default;
} catch (error) {
        console.error("Error loading User model:", error);
}

const CORRECT_SCORE = 10;

function isValidObjectId(id) {
        return mongoose.Types.ObjectId.isValid(id);
}

async function findTechniqueBySlug({ slug }) {
        const technique = await Technique.findOne({ slug }).lean();
        if (!technique) return { notFound: true };
        return { technique };
}

export async function listQuizzesBySlug(slug){
        const ref = await findTechniqueBySlug({ slug });
        if(ref.notFound) return { notFound: true };

        const { technique } = ref;
        const quizzes = await Quiz.find({ techniqueId: technique._id })
        .select("techniqueId rawQuestion questionParts questionType choices correctAnswer explanation")
        .sort({ createdAt: -1 })
        .lean();
        return { technique, quizzes };
}

function normalizeAnswer(str) {
        if (!str) return "";

        let s = str.trim().toLowerCase();

        s = s.replace(/[\(\)\[\]]/g, ""); //괄호 제거

        const hasXss = s.includes("xss");
        const hasCSRF = s.includes("csrf");

        if(s.includes("state")) return "state_parameter";
        if(s.includes("경로") || s.includes("path")) return "path_redirect";
        if(s.includes("쿼리") || s.includes("query")) return "query_redirect";

        if(hasXss){
                if(s.includes("dom")) return "dom_xss";
                if(s.includes("reflected") || s.includes("반사")) return "reflected_xss";
                if(s.includes("stored") || s.includes("저장")) return "stored_xss";
                return "xss";
        }
        return s.replace(/\s+/g, "_");
}

export async function checkAnswerAndAward({ userId, quizId, userAnswer }){
        if(!isValidObjectId(quizId)) return { notFound: true };
        const quiz =  await Quiz.findById(quizId).lean();
        if(!quiz) return { notFound: true };

        let correct = false;

        if(quiz.questionType === "choice"){
                correct = quiz.correctAnswer === userAnswer;
        } else {
                const normUser = normalizeAnswer(userAnswer);
                const normCorrect = normalizeAnswer(quiz.correctAnswer);

                correct = normUser === normCorrect;
        }

        const existingProcess = await QuizProcess.findOne({ userId, quizId: quiz._id });

        const attemptNumber = (existingProcess?.attempts ?? 0) + 1;

        const alreadySolvedBefore = existingProcess?.status === 'solved';

        //진행상황에 기록
        try {
                await QuizProcess.findOneAndUpdate(
                        { userId, quizId : quiz._id },
                        {
                                $set: {
                                        techniqueId: quiz.techniqueId,
                                        lastAnswer: userAnswer,
                                        lastCorrect: correct,
                                        lastAnsweredAt: new Date(),
                                        status: correct ? 'solved' : 'in_progress',
                                },
                                $inc: { attempts: 1 },
                        },
                        { upsert: true, new: true }
                );
        } catch (error) {
                console.error("Error updating QuizProcess:", error);
       }

        //오답노트에 기록
        if(!correct){
                await WrongNote.create({
                        userId,
                        quizId: quiz._id,
                        techniqueId: quiz.techniqueId,
                        rawQuestion: quiz.rawQuestion,
                        questionParts: quiz.questionParts || [],
                        questionType: quiz.questionType || "short",
                        choices: quiz.choices || [],
                        userAnswer: userAnswer,
                        correctAnswer: quiz.correctAnswer,
                        explanation: quiz.explanation || "",
                        attempt: attemptNumber,
                });
        }
        
        //정답 시 포인트 지급
        let totalPoints = undefined;
        let earned = 0;
        if(correct){
                if(alreadySolvedBefore){
                        earned = 0;
                } else {
                        earned = CORRECT_SCORE;
                        if(UserModel){
                                const updated = await UserModel.findByIdAndUpdate(
                                        userId,
                                        { $inc: { points: CORRECT_SCORE } },
                                        { new: true }
                                ).select("points").lean();
                                totalPoints = updated?.points;
                        }
                }
        }

        return {
                correct,
                correctAnswer: quiz.correctAnswer,
                explanation: quiz.explanation || "",
                earned,
                totalPoints
        };
}

export async function listWrongNotes({ userId, slug,page=1, size =20 }){
        const query = { userId };
        const ref = await findTechniqueBySlug({ slug });
        const { technique } = ref;

        const skip = (page -1) * size;

        const [ items, total ] = await Promise.all([
                WrongNote.find({ techniqueId: technique._id , ...query })
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(size)
                        .select("quizId userId techniqueId rawQuestion userAnswer correctAnswer explanation")
                        .lean(),
                WrongNote.countDocuments({ techniqueId: technique._id , ...query })
        ]);

        return { items, meta: { page, size, total }};
}
export async function listQuizProcessBySlug({ userId, slug}) {
        const ref = await findTechniqueBySlug({ slug });
        if(ref.notFound) return { notFound: true };

        const { technique } = ref;

        const quizProcesses = await QuizProcess.find({ userId, techniqueId: technique._id })
                .select("quizId techniqueId attempts lastAnswer lastCorrect lastAnsweredAt status")
                .lean();

        return { technique, quizProcesses };
}


export async function buildResultExplanation({ userId, slug}){
        const ref = await findTechniqueBySlug({ slug });
        if(ref.notFound) return { ok : false, message: "Technique not found" };

        const { technique } = ref;

        const totalCount = await Quiz.countDocuments({ techniqueId: technique._id });

        const lastAttempt = await WrongNote.find({ userId, techniqueId: technique._id })
                .sort({ createdAt: -1 })
                .limit(1)
                .then(res => res[0]?.attempt ?? 0);

        const wrongs = await WrongNote.find({ userId, techniqueId: technique._id, attempt: lastAttempt })
                .select("_id quizId rawQuestion userAnswer correctAnswer explanation")
                .lean();

        const items = wrongs.map((w) => ({
                quizId: String(w.quizId ?? w._id),
                question: w.rawQuestion ?? "",
                userAnswer: String(w.userAnswer ?? null),
                correctAnswer: String(w.correctAnswer ?? null),
                explanation: String(w.explanation ?? ""),
        }));

        console.log(`${items.length} wrong answers found for technique ${technique.title} (${technique._id}) by user ${userId}`);

        const aiPayload = { userId: String(userId), items};

        let aiResult;

        try{
                aiResult = await analyzeAnswersBatch({
                        payload : aiPayload,
                });
        }catch(error){
                console.error("Error analyzing answers:", error);
                return {
                        ok: true,
                        status : 200,
                        data: {
                                title: `${technique.title} 종합 해설`,
                                summary: "AI 응답 실패로 간단 요약만 제공합니다.",
                                focusAreas: [],
                                nextSteps: ["모델 호출 오류 — 잠시 후 재시도하세요."],
                                model: process.env.EXPLAIN_MODEL || "gpt-4o",
                                stats: { totalCount, correctCount: Math.max(0, totalCount - items.length), wrongCount: items.length },
                                createdAt: new Date(),
                        },
                };
        }

        const results = aiResult?.results || [];

        const wrongCount = items.length;
        const correctCount = Math.max(0, totalCount - wrongCount);

        const conceptMap = new Map();

        for(const r of results){
                for(const m of r.mistakeAnalysis || []){
                        const key = m.toLowerCase().slice(0, 80);
                        conceptMap.set(key, (conceptMap.get(key) || 0) +1);
                }
        }

        const focusAreas = Array.from(conceptMap.entries())
                .sort((a,b) => b[1] - a[1])
                .slice(0,5)
                .map(([k,v]) => `${k} (실수 횟수: ${v})`);
        
        const nextStepsSet = new Set();
        for(const r of results){
                const steps = r.stepByStepSolution || [];
                if(steps.length) nextStepsSet.add(steps[0]);
        }
        const nextSteps = Array.from(nextStepsSet).slice(0,5);

        return {
                ok: true,
                status : 200,
                data: {
                      title: `${technique.title} 종합 해설`,
                        summary:
                                results.length > 0
                                ? `총 ${totalCount}문항 중 ${correctCount}문항 정답, 오답 ${wrongCount}건에 대해 분석을 제공했습니다.`
                                : `해당 레벨에서 오답이 없습니다. 학습을 유지하세요.`,
                        focusAreas,
                        nextSteps,
                        model: process.env.EXPLAIN_MODEL || "gpt-4o",
                        stats: { totalCount, correctCount, wrongCount },
                        createdAt: new Date(),
                        perQuestionResults: results, // raw per-question AI results for frontend if needed  
                },
        }
}