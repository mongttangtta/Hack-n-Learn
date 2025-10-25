import Problem from "../models/problem.model.js";
import Practice from "../models/practice.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

//문제 목록 - 필터, 정렬, 풀이 여부
export const findProblemsWithFilters = async (userId, query) => {
        const match = {};

        if( query.type) match.type = query.type;
        if( query.difficulty) match.difficulty = query.difficulty;

        const sort = query.sort || { createdAt : -1};

        const problems = await Problem.find(match)
                .sort(sort)
                .select("title type difficulty score answerRate")
                .lean();

        let uid = null;
        if (userId) uid = new mongoose.Types.ObjectId(userId);
        const practices = await Practice.find({ user: uid })
                .select("problem result")
                .lean();
        
        const solvedSet = new Set(
                practices.filter(p => p.result === "success").map(p => p.problem.toString())
        );

        let filterd = problems;
        if (query.solved === "true") {
                filterd = problems.filter(p => solvedSet.has(p._id.toString()));
        }
        if (query.solved === "false") {
                filterd = problems.filter(p => !solvedSet.has(p._id.toString()));
        }

        return filterd.map(p => ({
                _id: p._id,
                title: p.title,
                type: p.type,
                difficulty: p.difficulty,
                score: p.score,
                answerRate: p.answerRate ?? null,
                isSolved: solvedSet.has(p._id.toString()),
        }));
};

//문제 상세 정보
export const getProblemById = async (problemId) => {
        return Problem.findById(problemId)
        .select("title description type difficulty score answerRate createdAt")
        .lean();
};

export const submitFlag = async ({userId, problemId, flag}) => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
                const problem = await Problem.findById(problemId).session(session);
                if (!problem) throw new Error("문제를 찾을 수 없습니다.");

                const isCorrect = problem.flag === flag;
                const uid = mongoose.Types.ObjectId(userId);

                const practiceData = {
                        user: uid,
                        problem: problem._id,
                        result: isCorrect ? "success" : "fail",
                        score: isCorrect ? problem.score : 0,
                        usedHint: 0,
                        solvedAt: isCorrect ? new Date() : null,
                };
                await Practice.create([practiceData], { session });

                if( isCorrect ) {
                        await User.findByIdAndUpdate(userId, { $inc: { points: problem.score } }).session(session);
        }
        
        await session.commitTransaction();
        session.endSession();
        return {
                correct: isCorrect,
                gained : isCorrect ? problem.score : 0,
                message: isCorrect ? "정답입니다!" : "오답입니다. 다시 시도해보세요.",  
        };
} catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
}};

export const requestHint = async ({ userId, problemId, stage }) => {
        const uid = mongoose.Types.ObjectId(userId);

        const practice = await Practice.findOne({ user: uid, problem: problemId});

        const usedHint = (practice?.usedHint || 0) + 1;
        await Practice.UpdateOne(
                { user: uid, problem: problemId },
                { 
                        $set: { usedHint },
                        $setOnInsert: { result: "fail", solvedAt: new Date() },
                 },
                { upsert: true }
        );

        const problem = await Problem.findById(problemId).select("score");
        const penalty = Math.round((problem.score * 0.1) * usedHint);
        await User.findByIdAndUpdate(uid, { $inc: { points: -penalty } });

        const hint = `힌트 ${stage}단계: 핵심 개념을 복기해보세요. (예시)`;
        
        return { hint, usedHint, penalty };
};