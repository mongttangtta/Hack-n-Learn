import User from '../models/user.model.js';
import Problem from '../models/problem.model.js';
import ProblemPersonal from '../models/problemPersonal.model.js';
import Technique from '../models/theory.model.js';
import Quiz from '../models/quiz.model.js';
import QuizProcess from '../models/quizProcess.model.js';
import { uploadToR2, deleteFromR2 } from '../utils/uploadToR2.js';
import mongoose from 'mongoose';

export const getMyPageData = async (userId) => {
        const uid = new mongoose.Types.ObjectId(userId);

        const profile = await User.findById(uid)
        .select("nickname tier points createdAt lastLogin isProfileComplete profileImageUrl profileImageKey")
        .lean();

        const personal = await ProblemPersonal.find({ user: uid })
        .sort({ solvedAt: -1 })
        .limit(100)
        .lean();

        const problemIds = [ ...new Set(personal.map(p => p.problem.toString())) ];

        const problems = await Problem.find({ _id: { $in: problemIds } })
        .select("slug score answerRate isActive")
        .lean();

        const problemMap = new Map(problems.map(p => [p._id.toString(), p]));

        const practiceList = personal.map((p) => ({
                ...p,
                problem: problemMap.get(p.problem.toString()) || null,
        }));

        const total = personal.length;
        const successCount = personal.filter(p => p.result === 'success').length;
        const successRate = total === 0 ? 0 : Math.round((successCount / total) * 100);

        const typeStats = await ProblemPersonal.aggregate([
                { $match: { user: uid } },
                {
                        $lookup: {
                                from : 'problems',
                                localField : 'problem',
                                foreignField : '_id',
                                as : 'problem',
                        },
                },
                { $unwind: '$problem' },
                {
                        $group: {
                                _id: '$problem.slug',
                                total: { $sum: 1 },
                                successCount: {
                                        $sum: { $cond: [ { $eq: ['$result', 'success'] }, 1, 0 ] }
                                },
                        },
                },
                {
                        $project: {
                                _id: 0,
                                type: '$_id',
                                total: 1,
                                successCount: 1,
                                progress: {
                                        $round : [
                                                {
                                                        $multiply: [
                                                                { $divide: ['$successCount', '$total'] },
                                                                100
                                                        ],
                                                },
                                                2,
                                        ],
                                },
                        },
                },
        ]);

        const quizProgress = await getQuizProgressForUser(uid);

        return { 
                profile, 
                practice : {
                total,
                successCount,
                successRate,
                typeStats,
                practiceList,
        },
         quizProgress
        } };

const getQuizProgressForUser = async (userId) => {
        const technique = await Technique.find({})
                .select('_id slug title')
                .lean();

        const quizzesByTechnique = await Quiz.aggregate([
                {
                        $group: {
                                _id: '$techniqueId',
                                totalCount: { $sum: 1 },
                        },
                },
        ]);

        const solvedByTechnique = await QuizProcess.aggregate([
                {
                        $match: {
                                userId : userId,
                                status : 'solved'
                        },
                },
                {
                        $group: {
                                _id: '$techniqueId',
                                solvedCount: { $sum: 1 },
                        },
                },
        ]);
        const totalMap = new Map(
                quizzesByTechnique.map((q) => [String(q._id), q.totalCount])
        );

        const solvedMap = new Map(
                solvedByTechnique.map((s) => [String(s._id), s.solvedCount])
        );

        const parts = technique.map((t) => {
                const key = String(t._id);
                const total = totalMap.get(key) || 0;
                const solved = solvedMap.get(key) || 0;
                const progress = total === 0 ? 0 : Math.round((solved / total) * 100);

                let status = 'not_started';
                if(total > 0 && solved === total) status = 'solved';
                else if(solved > 0) status = 'in_progress';

                return {
                        techniqueId: t._id,
                        slug: t.slug,
                        title: t.title,
                        solvedCount: solved,
                        totalCount : total,
                        progress,
                        status,
                };
        });
        const totalQuizzes = parts.reduce((acc, p) => acc + p.totalCount, 0);
        const solvedQuizzes = parts.reduce((acc, p) => acc + p.solvedCount, 0);
        const overallProgress = totalQuizzes === 0 ? 0 : Math.round((solvedQuizzes / totalQuizzes) * 100);

        return {
                summary: {
                        totalQuizzes,
                        solvedQuizzes,
                        progress: overallProgress,
                },
                parts,
                }
}
export const linkAccount = async (userId, { provider, oauthId, email }) => {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        if(provider === 'google') {
                user.linkedAccounts.google = { id: oauthId, email };
        } else if(provider === 'github') {
                user.linkedAccounts.github = { id: oauthId, email };
        }

        if(user.provider === 'local') {
                user.provider = provider;
                user.oauthId = oauthId;
        }

        await user.save();
        return user;
};

export const updateProfileimage = async (userId, file) => {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        if(user.profileImageKey) {
                try {
                        await deleteFromR2(user.profileImageKey);
                } catch (error) {
                        console.error("Error deleting old profile image from R2:", error);
                }
        }

        const { imageUrl, key } = await uploadToR2(file);

        user.profileImageUrl = imageUrl;
        user.profileImageKey = key;
        await user.save();
        return imageUrl;
};

export const getUserProfile = async (userId) => {

        const uid = new mongoose.Types.ObjectId(userId);
        //프로필
        const profile = await User.findById(uid)
        .select("nickname tier points createdAt lastLogin isProfileComplete profileImageUrl profileImageKey linkedAccounts")
        .lean();

        if(!profile) throw new Error("User not found");

        //실전
        const practice = await ProblemPersonal.find({ user: uid })
        .sort({ solvedAt: -1 })
        .lean();

        //퀴즈
        const quiz = await QuizProcess.find({ userId: uid })
        .sort({ lastAnsweredAt: -1 })
        .lean();

        return {
                profile,
                practice,
                quiz
        }
};