import * as quizService from "../services/quiz.service.js";


// GET /api/theory/quiz/:slug
export async function getQuizzesBySlug(req, res, next) {
        try {
                const { slug } = req.params;
                const result = await quizService.listQuizzesBySlug(slug);
                if(result?.notFound){
                        return res.status(404).json({ success: false, message: "데이터가 존재하지 않습니다." });
                }
                return res.json({ success: true, data: result });
        } catch(err){
                next(err);
        }        
}

// GET /api/theory/quiz-process/:slug
export async function getQuizProcessBySlug(req, res, next) {
        try {
                const userId = req.session?.userId;
                if(!userId) return res.status(401).json({ success: false, message: "로그인이 필요합니다." });
                const { slug } = req.params;
                const result = await quizService.listQuizProcessBySlug({ userId, slug });
                if(result?.notFound){
                        return res.status(404).json({ success: false, message: "데이터가 존재하지 않습니다." });
                }
                return res.json({ success: true, data: result.quizProcesses });
        } catch(err){
                next(err);
        }        
}

// POST /api/theory/quiz/:quizId/check
export async function checkAnswerAndAward(req, res, next) {
        try{
                const userId = req.session?.userId;
                if(!userId) return res.status(401).json({ success: false, message: "로그인이 필요합니다." });

                const { quizId }  = req.params;
                const { userAnswer } = req.body;
                if(userAnswer === undefined) return res.status(400).json({ success: false, message: "userAnswer 가 필요합니다." });

                const result = await quizService.checkAnswerAndAward({ userId, quizId, userAnswer});
                if(result?.notFound){
                        return res.status(404).json({ success: false, message: "데이터가 존재하지 않습니다." });
                }
                return res.json({ success: true, data: result });
        } catch(err){
                next(err);
        }
}


// GET /api/theory/quiz/wrong-notes
export async function getWrongNotes(req, res, next) {
        try{
                const userId = req.session?.userId;
                if(!userId) return res.status(401).json({ success: false, message: "로그인이 필요합니다." });

                const { slug } = req.params;
                const page = parseInt(req.query.page || "1" , 10);
                const size = parseInt(req.query.size || "20", 10);

                const result = await quizService.listWrongNotes({ userId, slug, page, size });
                return res.json({ success: true, data: result.items, meta: result.meta });
        } catch(err){
                next(err);
        }
}

// POST /api/theory/quiz/:slug/result-explanation
export async function generateQuizResultExplanation(req, res, next) {
        try {
                const userId = req.session?.userId;
                if(!userId) return res.status(401).json({ success: false, message: "로그인이 필요합니다." });

                const { slug } = req.params;
                const out = await quizService.buildResultExplanation({ userId, slug });

                if(out?.notFound){
                        return res.status(404).json({ success: false, message: "데이터가 존재하지 않습니다." });
                }

                return res.json({ success: true, data: out });
        } catch(err){
                next(err);
        }
}