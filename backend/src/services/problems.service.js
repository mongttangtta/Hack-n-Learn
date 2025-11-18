import Problem from "../models/problem.model.js";
import ProblemPersonal from "../models/problemPersonal.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const findProblemByIdentifier = async (identifier, session = null) => {
        if(typeof identifier === 'string') return null;
        const id = identifier.trim();

        if(mongoose.Types.ObjectId.isValid(id)) {
                return session ? Problem.findById(id).session(session) : Problem.findById(id);
        }
        const slug = id.toLowerCase();
        return session ? Problem.findOne({ slug }).session(session) : Problem.findOne({ slug });
};

export const submitFlag = async ({userId, problemId, flag}) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
                const problem = await findProblemByIdentifier(problemId, session);
                if (!problem) throw new Error("문제를 찾을 수 없습니다.");

                const uid = mongoose.Types.ObjectId(userId);
                let problemPersonal = await ProblemPersonal.findOne({ user: uid, problem: problem._id }).session(session);

                if (!problemPersonal) {
                        problemPersonal = new ProblemPersonal({
                                user: uid,
                                problem: problem._id,
                                penalty: 0,
                                userHints: 0,
                                result: "unsolved",
                                score : problem.score,
                        });
                }

                const isCorrect = (flag === problem.flag);

                if(!isCorrect) {//오답 패널티가 힌트 요청한 만큼 + 틀린 횟수 만큼
                        problemPersonal.penalty += 10;
                        problemPersonal.result = "fail";
                        await problemPersonal.save({ session });
                } else {
                        const finalScore = Math.max(problemPersonal.score - problemPersonal.penalty, 0);

                        problemPersonal.result = "success";
                        problemPersonal.score = finalScore;
                        problemPersonal.solvedAt = new Date();
                        await problemPersonal.save({ session });
                        await User.findByIdAndUpdate(
                                userId,
                                { $inc : { points: finalScore}},
                                { session }
                        );

                        const totalUsers = await User.countDocuments({ isActive: true }).session(session);

                        const successCount = await ProblemPersonal.countDocuments({ 
                                problem: problem._id, 
                                result: "success"
                        }).session(session);

                        const updateRate = totalUsers === 0 ? 0 : successCount / totalUsers;

                        await Problem.findByIdAndUpdate(
                                problem._id,
                                { answerRate: updateRate },
                                { session }
                        );
                }
                await session.commitTransaction();
                session.endSession();
                return {
                        correct: isCorrect,
                        gained : isCorrect ? Math.max(problemPersonal.score - problemPersonal.penalty, 0) : 0,
                        message: isCorrect ? "정답입니다!" : "오답입니다. 다시 시도해보세요.",  
                };
        } catch (error) {
                await session.abortTransaction();
                session.endSession();
                throw error;
        }};

export const requestHint = async ({ userId, problemId, stage }) => {
        const uid = new mongoose.Types.ObjectId(userId);
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
                const problem = await findProblemByIdentifier(problemId, session)
                if (!problem) throw new Error("문제를 찾을 수 없습니다.");

                let personal = await ProblemPersonal.findOne({ user: uid, problem: problem._id }).session(session);
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
                await personal.save({ session });

                const hint = problem.hints?.find(h => h.stage === stage)?.content || `힌트 ${stage}단계: 핵심 개념을 복기해보세요.`;
                await session.commitTransaction();
                session.endSession();
                return {
                        hint,
                        penaltyApplied: penaltyIncrement,
                        totalPenalty: personal.penalty,
                        usedHint : personal.userHints,
                        remainingPotentialScore : Math.max(personal.score - personal.penalty, 0),
                };
        } catch (error) {
                await session.abortTransaction();
                session.endSession();
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