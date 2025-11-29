import * as problemsService from "../services/problems.service.js";

export const submitFlag = async (req, res, next) => {
        try {
                const userId = req.session.userId;

                if(!userId) {
                        return res.status(401).json({ success: false, message: "로그인이 필요합니다." });
                }
                const { slug } = req.params;
                const { flag } = req.body; // 사용자가 제출한 플래그

                const result = await problemsService.submitFlag({ userId, slug, flag });
                res.json ({ success: true, data : result });
        } catch (error) {
                next(error);
        }
};

export const requestHint = async (req, res, next) => {
        try {
                const userId = req.session.userId;

                if(!userId) {
                        return res.status(401).json({ success: false, message: "로그인이 필요합니다." });
                }
                const { slug } = req.params;
                const { stage } = req.body; // 요청하는 힌트 단계

                const hint = await problemsService.requestHint({ userId, slug, stage });
                res.json({ success: true, data: hint });
        } catch (error) {
                next(error);
        }
};

export const getProgressList = async (req, res, next) => {
        try {
                const userId = req.session.userId;

                if(!userId) {
                        return res.status(401).json({ success: false, message: "로그인이 필요합니다." });
                }
                const data = await problemsService.getProblemProgressList(userId);
                res.json({ success: true, data });
        } catch (error) {
                next(error);
        }
};

export const getProblemDetails = async (req, res, next) => {
        try {
                const { slug } = req.params;

                const problem = await problemsService.getProblemDetailsBySlug(slug);

                if (!problem) return res.status(404).json({ success: false, message: "Problem not found" });

                res.json({ success: true, data: problem });
        } catch (error) {
                next(error);
        }
};
// export const listProblems = async (req, res, next) => {
//         try {
//                 const userId = req.user.id;
//                 const filters = req.query;
//                 const problems = await problemsService.findProblemsWithFilters(userId, filters);
//                 res.json({ success: true, data : problems });
//         } catch (error) {
//                 next(error);
//         }
// };

// export const getProblem = async (req, res, next) => {
//         try {
//                 const problemId = req.params.id;
//                 const problem = await problemsService.getProblemById(problemId);
//                 if (!problem) {
//                         return res.status(404).json({ success: false, message: "Problem not found" });
//                 }
//                 res.json({ success: true, data: problem });
//         } catch (error) {
//                 next(error);
//         }
// };