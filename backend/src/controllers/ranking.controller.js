import User from '../models/user.model.js';

export const getRankings = async (req, res) => {
        try{
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const skip = (page - 1) * limit;

                const users = await User.find({}, { passwordHash : 0})
                        .sort({ points: -1})
                        .skip(skip)
                        .limit(limit)
                        .lean();

                const totalUsers = await User.countDocuments();
                const totalPages = Math.ceil(totalUsers / limit);

                return res.json({
                        success: true,
                        data: {
                                totalUsers,
                                totalPages,
                                page,
                                limit,
                                users: users.map((user, index)=> ({
                                        rank : skip + index + 1,
                                        nickname : user.nickname,
                                        tier : user.tier,
                                        points : user.points
                                })),
                        },
                });
        } catch (error) {
                console.error('Error fetching rankings:', error);
                return res.status(500).json({ success: false, message: '서버 오류' });
        }
};

export const getMyRanking = async (req, res) => {
        try {
                const userId = req.user?._id;

                if(!userId) return res.status(401).json({ success: false, message: '인증되지 않은 사용자'});

                const me = await User.findById(userId).lean();
                if(!me) return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.'});

                const rank = await User.countDocuments({ points: { $gt: me.points }}) + 1;

                return res.json({
                        success: true,
                        data: {
                                rank,
                                nickname: me.nickname,
                                tier: me.tier,
                                points: me.points,
                        },
                });
        } catch (error) {
                console.error('Error fetching user ranking:', error);
                return res.status(500).json({ success: false, message: '서버 오류' });
        }
};
