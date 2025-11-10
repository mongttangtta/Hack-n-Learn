import { ChatBotService } from "../services/chatBot.service.js";

export class ChatBotController {
        static async postAsk(req, res) {
                try {
                        const userId = req.user?._id || req.user?.id;
                        const { message, threadId} = req.body || {};

                        const { threadId: tid, answer} = await ChatBotService.ask({
                                userId,
                                threadId: threadId,
                                message: message
                        });

                        res.status(200).json({
                                success: true,
                                data : { threadId: tid, answer }
                        })
                } catch (error) {
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
                        const userId = req.user?._id || req.user?.id;
                        const { threadId } = req.params;
                        const limit = Nubmer(req.query.limit) || 50;

                        const messages = await ChatBotService.getHistory({
                                userId,
                                threadId,
                                limit,
                        });
                        res.status(200).json({
                                success: true,
                                data : messages,
                        });
                } catch (error) {
                        const msg = String(error?.message || "");
                        if(msg === "Unauthorized"){
                                res.status(401).json({ success: false, message: "로그인이 필요합니다." });
                        }
                        if(msg === "threadId required"){
                                res.status(400).json({ success: false, message: "유효하지 않은 대화 세션입니다." });
                        }
                        res.status(500).json({ success: false, message: "챗봇 대화 내역 조회 중 오류가 발생했습니다." });
                }
        }
}