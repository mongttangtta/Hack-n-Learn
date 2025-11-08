import mongoose from "mongoose";
import Technique from "../models/theory.model.js";
import Quiz from "../models/quiz.model.js";
import WrongNote from "../models/wrongNode.model.js";
import dotenv from "dotenv";
dotenv.config({path: process.env.ENV_PATH || "/backend/backend/.env"});
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
        .select("techniqueId questionParts correctAnswer explanation")
        .sort({ createdAt: -1 })
        .lean();
        return { technique, quizzes };
}

export async function checkAnswerAndAward({ userId, quizId, userAnswer }){
        if(!isValidObjectId(quizId)) return { notFound: true };
        const quiz =  await Quiz.findById(quizId).lean();
        if(!quiz) return { notFound: true };

        const correct = quiz.correctAnswer === userAnswer;

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
                });
        }
        
        let totalPoints = undefined;
        let earned = 0;
        if(correct && UserModel){
                earned = CORRECT_SCORE;
                const updated = await UserModel.findByIdAndUpdate(
                        userId,
                        { $inc: { points: CORRECT_SCORE } },
                        { new: true }
                ).select("points").lean();
                totalPoints = updated?.points;
        } else if(correct){
                earned = CORRECT_SCORE;
        }

        return {
                correct,
                correctAnswer: quiz.correctAnswer,
                explanation: quiz.explanation || "",
                earned,
                totalPoints
        };
}

export async function listWrongNotes({ userId, techniqueId,page=1, size =20 }){
        const query = { userId };
        if(techniqueId) query.techniqueId = techniqueId;

        const skip = (page -1) * size;

        const [ items, total ] = await Promise.all([
                WrongNote.find(query)
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(size)
                        .select("quizId userId techniqueId rawQuestion userAnswer correctAnswer explanation")
                        .lean(),
                WrongNote.countDocuments(query)
        ]);

        return { items, meta: { page, size, total }};
}


export async function buildResultExplanation({ userId, slug}){
        const ref = await findTechniqueBySlug({ slug });
        if(ref.notFound) return { ok : false, message: "Technique not found" };

        const { technique } = ref;

        const totalCount = await Quiz.countDocuments({ techniqueId: technique._id });

        const wrongs = await WrongNote.find({ userId, techniqueId: technique._id })
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
                        model : process.env.EXPLAIN_MODEL || "gpt-4o",
                        timeoutMs : parseInt(process.env.EXPLAIN_TIMEOUT_MS) || 12000,
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