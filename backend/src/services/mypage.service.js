import User from '../models/user.model.js';
import Problem from '../models/problem.model.js';
import ProblemPersonal from '../models/problemPersonal.model.js';
import Technique from '../models/theory.model.js';
import Quiz from '../models/quiz.model.js';
import QuizProcess from '../models/quizProcess.model.js';
import { uploadToR2, deleteFromR2 } from '../utils/uploadToR2.js';
import mongoose from 'mongoose';

function calculateTier(points) {
        if(points >= 750) return 'platinum';
        if(points >= 500) return 'gold';
        if(points >= 250) return 'silver';
        return 'bronze';
}

export const getMyPageData = async (userId) => {
    const uid = new mongoose.Types.ObjectId(userId);

    // 사용자 프로필 조회
    const profile = await User.findById(uid)
        .select("nickname tier titles points createdAt lastLogin isProfileComplete profileImageUrl profileImageKey")
        .lean();

    // 최근 실전 문제 로그
    const personal = await ProblemPersonal.find({ user: uid })
        .sort({ solvedAt: -1 })
        .limit(100)
        .lean();

    // 실전 문제 원본 조회
    const problemIds = [...new Set(personal.map(p => p.problem.toString()))];
    const problems = await Problem.find({ _id: { $in: problemIds } })
        .select("slug score answerRate isActive")
        .lean();

    // 🔥 티어 업데이트
    const newTier = calculateTier(profile.points);
    if (profile.tier !== newTier) {
        await User.findByIdAndUpdate(uid, { tier: newTier });
        profile.tier = newTier; // 응답 데이터 반영
    }

    // 🔥 퀴즈 전체 진행률 계산
    const quizProgress = await getQuizProgressForUser(uid);

    // 🔥 마스터 칭호 계산
    const masteredTitles = quizProgress.parts
        .filter(part => part.totalCount > 0 && part.solvedCount === part.totalCount)
        .map(part => `${part.slug} 마스터`);

    // 🔥 기존 titles 유지 + 새 칭호만 추가
    if (masteredTitles.length > 0) {
        await User.findByIdAndUpdate(uid, {
            $addToSet: { titles: { $each: masteredTitles } }
        });
    }

    // 프로필 응답 값에 반영 (기존 titles + 신규 titles)
    profile.titles = Array.from(new Set([...(profile.titles ?? []), ...masteredTitles]));

    // 실전 문제 정보 매핑
    const problemMap = new Map(problems.map(p => [p._id.toString(), p]));

    const practiceList = personal.map((p) => ({
        ...p,
        problem: problemMap.get(p.problem.toString()) || null,
    }));

    // 실전 통계
    const total = personal.length;
    const successCount = personal.filter(p => p.result === "success").length;
    const successRate = total === 0 ? 0 : Math.round((successCount / total) * 100);

    const typeStats = await ProblemPersonal.aggregate([
        { $match: { user: uid } },
        {
            $lookup: {
                from: "problems",
                localField: "problem",
                foreignField: "_id",
                as: "problem",
            },
        },
        { $unwind: "$problem" },
        {
            $group: {
                _id: "$problem.slug",
                total: { $sum: 1 },
                successCount: {
                    $sum: { $cond: [{ $eq: ["$result", "success"] }, 1, 0] }
                },
            },
        },
        {
            $project: {
                _id: 0,
                type: "$_id",
                total: 1,
                successCount: 1,
                progress: {
                    $round: [
                        {
                            $multiply: [
                                { $divide: ["$successCount", "$total"] },
                                100
                            ],
                        },
                        2,
                    ],
                },
            },
        },
    ]);

    // 최종 반환
    return {
        profile,
        practice: {
            total,
            successCount,
            successRate,
            typeStats,
            practiceList,
        },
        quizProgress,
    };
};


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

export const isNicknameAvailable = async (nickname) => {
        const exists = await User.exists({ nickname });
        return !exists;
};

export const updateNickname = async (userId, nickname) => {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        const COOLDOWN_MS = 24  * 60 * 60 * 1000;
        const now = new Date();


        //cooldown 체크
        if(user.lastNicknameChangeAt) {
                const diff = now - user.lastNicknameChangeAt.getTime();

                if( diff < COOLDOWN_MS) {
                        const remainMs = COOLDOWN_MS - diff;
                        const remainHours = Math.ceil(remainMs / 1000 / 60 / 60);

                        return {
                                cooldown: true,
                                nextAvailableAt: new Date(now + remainMs),
                                remainHours
                        };
                }
        }
        user.nickname = nickname;
        user.lastNicknameChangeAt = now;
        await user.save();

        return {
                cooldown: false,
                nickname: user.nickname
        }
};