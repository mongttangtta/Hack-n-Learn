import Problem from "../models/problem.model.js";
import ProblemPersonal from "../models/problemPersonal.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export function normalizeFlag(flag) {
    if (!flag) return "";

    // 기본 정규화 (NFKC + 제로폭 제거 + 앞뒤 공백만 제거)
    let f = String(flag)
        .normalize("NFKC")
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .trim();

    // 정답 형식: 정확히 FLAG{...} (공백 포함, 대문자 고정)
    const regex = /^FLAG\{.*\}$/;

    if (regex.test(f)) {
        return f;  // 정상적인 FLAG{...}
    }

    // 나머지는 절대 자동 수정하지 않고 그대로 반환
    return f;
}


export const resetProblemState = async ({ userId, slug}) => {
        const problem = await Problem.findOne({ slug, isActive: true });
        if (!problem) throw new Error("문제를 찾을 수 없습니다.");

        const uid = new mongoose.Types.ObjectId(userId);

        let personal = await ProblemPersonal.findOne({ user: uid, problem: problem._id });

        if(personal) {
                personal.penalty = 0;
                personal.userHints = 0;
                personal.score = problem.score;
                await personal.save();
        }

        return {
                success: true,
                message: "문제 풀이 상태가 초기화되었습니다.",
        }
}


export const submitFlag = async ({userId, slug, flag}) => {
        try {
                const problem = await Problem.findOne({slug, isActive: true});
                if (!problem) throw new Error("문제를 찾을 수 없습니다.");

                const uid = new mongoose.Types.ObjectId(userId);
                let problemPersonal = await ProblemPersonal.findOne({ user: uid, problem: problem._id });

                if (!problemPersonal) {
                        problemPersonal = new ProblemPersonal({
                                user: uid,
                                problem: problem._id,
                                penalty: 0,
                                userHints: 0,
                                result: "unsolved",
                                score : problem.score,
                        });
                } else {
                        // 이미 정답을 맞춘 문제는 재제출 불가
                        if(problemPersonal.result === "success") {
                                return {
                                        correct: true,
                                        gained: 0,
                                        message: "이미 정답을 제출한 문제입니다."
                                };
                        }
                }                

                const userAnswer = normalizeFlag(flag);
                const correctAnswer = normalizeFlag(problem.flag);

                console.log(`[DEBUG] User submitted flag: "${userAnswer}", Correct flag: "${correctAnswer}"`);

                const isCorrect = userAnswer === correctAnswer;

                if(!isCorrect) {//오답 패널티가 힌트 요청한 만큼 + 틀린 횟수 만큼
                        problemPersonal.penalty += 10;
                        problemPersonal.result = "fail";
                        await problemPersonal.save();
                } else {
                        const finalScore = Math.max(problemPersonal.score - problemPersonal.penalty, 0);

                        problemPersonal.result = "success";
                        problemPersonal.score = finalScore;
                        problemPersonal.solvedAt = new Date();
                        await problemPersonal.save();
                        await User.findByIdAndUpdate(
                                userId,
                                { $inc : { points: finalScore}},
                        );

                        const totalUsers = await User.countDocuments({ isActive: true });

                        const successCount = await ProblemPersonal.countDocuments({ 
                                problem: problem._id, 
                                result: "success"
                        });

                        const updateRate = totalUsers === 0 ? 0 : successCount / totalUsers;

                        await Problem.findByIdAndUpdate(
                                problem._id,
                                { answerRate: updateRate }
                        );
                }
                return {
                        correct: isCorrect,
                        gained : isCorrect ? Math.max(problemPersonal.score - problemPersonal.penalty, 0) : 0,
                        message: isCorrect ? "정답입니다!" : "오답입니다. 다시 시도해보세요.",  
                };
        } catch (error) {
                throw error;
        }};

export const requestHint = async ({ userId, slug, stage }) => {
        try {
                const problem = await Problem.findOne({ slug, isActive: true });
                if (!problem) throw new Error("문제를 찾을 수 없습니다.");

                const uid = new mongoose.Types.ObjectId(userId);

                let personal = await ProblemPersonal.findOne({ user: uid, problem: problem._id });
                if( !personal ) {
                        personal = new ProblemPersonal({
                                user: uid,
                                problem: problem._id,
                                penalty: 0,
                                userHints: 0,
                                score : 100,
                                result: "unsolved",
                        });
                }

                const penaltyIncrement = 10;
                personal.penalty += penaltyIncrement;
                personal.userHints += 1;
                await personal.save();

                const hints = problem.hints?.filter(h => h.stage === stage)?.map(h => ({ type : h.type, content: h.content })) || [{
                        type: "text",
                        content: `힌트 ${stage}단계: 핵심 개념을 복기해보세요.`
                }];
                return {
                        hints,
                        penaltyApplied: penaltyIncrement,
                        totalPenalty: personal.penalty,
                        usedHint : personal.userHints,
                        remainingPotentialScore : Math.max(personal.score - personal.penalty, 0),
                };
        } catch (error) {
                throw error;
        }
};

export const getProblemProgressList = async (userId) => {
        const problems = await Problem.find({ isActive: true })
                .select("slug title difficulty score answerRate")
                .lean();

        const personalList = await ProblemPersonal.find({ user: userId })
                .select("problem result")
                .lean();

        const personalMap = new Map();
        personalList.forEach(p => {
                personalMap.set(p.problem.toString(), p.result);
        });

        return problems.map(p => ({
                slug: p.slug,
                title: p.title,
                difficulty: p.difficulty,
                answerRate: p.answerRate ?? 0,
                result : personalMap.get(p._id.toString()) || "unsolved",
        }));
};

export const getProblemDetailsBySlug = async (slug) => {
        const problem = await Problem.findOne({ slug, isActive: true })
                .select("slug title difficulty scenario goals")
                .lean();

        if( !problem ) return null;
        return problem;
};


//문제 목록 - 필터, 정렬, 풀이 여부
// export const findProblemsWithFilters = async (userId, query) => {
//         const match = {};

//         if( query.type) match.type = query.type;
//         if( query.difficulty) match.difficulty = query.difficulty;

//         const sort = query.sort || { createdAt : -1};

//         const problems = await Problem.find(match)
//                 .sort(sort)
//                 .select("title type difficulty score answerRate")
//                 .lean();

//         let uid = null;
//         if (userId) uid = new mongoose.Types.ObjectId(userId);
//         const practices = await Practice.find({ user: uid })
//                 .select("problem result")
//                 .lean();
        
//         const solvedSet = new Set(
//                 practices.filter(p => p.result === "success").map(p => p.problem.toString())
//         );

//         let filterd = problems;
//         if (query.solved === "true") {
//                 filterd = problems.filter(p => solvedSet.has(p._id.toString()));
//         }
//         if (query.solved === "false") {
//                 filterd = problems.filter(p => !solvedSet.has(p._id.toString()));
//         }

//         return filterd.map(p => ({
//                 _id: p._id,
//                 title: p.title,
//                 type: p.type,
//                 difficulty: p.difficulty,
//                 score: p.score,
//                 answerRate: p.answerRate ?? null,
//                 isSolved: solvedSet.has(p._id.toString()),
//         }));
// };

//문제 상세 정보
// export const getProblemById = async (problemId) => {
//         return Problem.findById(problemId)
//         .select("title description type difficulty score answerRate createdAt")
//         .lean();
// };