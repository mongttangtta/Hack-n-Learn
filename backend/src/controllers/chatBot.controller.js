import { ChatBotService } from "../services/chatBot.service.js";

export class ChatBotController {
        static async postAsk(req, res) {
                try {
                        const userId = req.session?.userId || null;
                        const { message, threadId} = req.body || {};

                        const { threadId: tid, answer, isNewSession } = await ChatBotService.ask({
                                userId,
                                threadId,
                                message
                        });

                        if(userId){
                                res.clearCookie("guestThreadId");
                        } else if(isNewSession){
                                res.cookie("guestThreadId", tid, {
                                        httpOnly: true,
                                        secure: process.env.NODE_ENV === "production",
                                        sameSite: "Lax",
                                        maxAge: 6 * 60 * 60 * 1000, // 6 hours
                                }
                                )};

                        res.status(200).json({
                                success: true,
                                data : { threadId: tid, answer }
                        })
                } catch (error) {
                        console.error("Chatbot Error:", error);
                        const msg = String(error?.message || "");
                        if(msg === "Unauthorized"){
                                res.status(401).json({ success: false, message: "로그인이 필요합니다." });
                        }
                        if(msg === "Empty Message" || msg === "Invalid message"){
                                res.status(400).json({ success: false, message: "유효하지 않은 입력입니다." });
                        }
                        if(msg === "Message too long"){
                                res.status(400).json({ success: false, message: "메시지가 너무 깁니다." });
                        }

                        res.status(500).json({ success: false, message: "챗봇 응답 중 오류가 발생했습니다." });
                }
        }

        static async getHistory(req, res) {
                try {
                        const userId = req.session?.userId || null;
                        const guestThreadId = req.cookies?.guestThreadId;
                        const threadId = req.body.threadId;
                        const limit = Number(req.query.limit) || 50;

                        if(userId){
                                const data = await ChatBotService.getHistoryByUser({
                                        userId,
                                        threadId,
                                        limit,
                                });

                                return res.status(200).json({
                                        success: true,
                                        data,
                                });
                        }

                        

                        if(!guestThreadId){
                                return res.status(200).json({
                                        success: true,
                                        data: [],
                                });
                        }

                        const data = await ChatBotService.getHistoryByThread({
                                threadId: guestThreadId,
                                limit,
                        });
                        res.status(200).json({
                                success: true,
                                data,
                        });
                } catch (error) {
                        console.error("Chatbot Error:", error);
                        return res.status(500).json({
                                success: false,
                                message: "히스토리 조회 중 오류가 발생했습니다.",
                        });
                } 
        }
}