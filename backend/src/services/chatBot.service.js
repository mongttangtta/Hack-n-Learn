import  ChatBotMessage  from "../models/chatBot.model.js";
import { chatCompletion } from "../utils/ai.client.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

function sanitize(text){
        if(!text) return "";
        const noTags = String(text).replace(/<[^>]*>/g, "");
        return noTags.replace(/\s+/g, " ").trim();
}

const CONTEXT_LIMIT = Number(process.env.CHAT_CONTEXT_LIMIT) || 10;
const USER_INPUT_MAX = Number(process.env.CHAT_USER_INPUT_MAX) || 1000;

export class ChatBotService {
        /**
         * 플로팅 챗봇 - 질문 처리
         * @param {Object} p
         * @param {string} p.userId
         * @param {string} [p.threadId] - 없으면 신규 ObjectId 생성
         * @param {string} p.message
         * @returns {Promise<{threadId: string, answer: string}>}
         */
        static async ask({ userId, threadId, message}){
                if(!userId) throw new Error("Unauthorized");
                if(!message) throw new Error("Empty message");

                const clean = sanitize(message);
                if(!clean) throw new Error("Invalid message");
                if(clean.length > USER_INPUT_MAX) throw new Error("Message too long");

                const sessionId = threadId || new mongoose.Types.ObjectId().toHexString();

                const historyDocs = await ChatBotMessage.find({ userId, threadId: sessionId })
                        .sort({ createdAt: -1 })
                        .limit(CONTEXT_LIMIT * 2) // Q&A 쌍이므로 2배
                        .lean();
                const history = historyDocs.reverse().map((m) => ({
                        role: m.role,
                        content: m.content
                }));

                const system = {
                        role : "system",
                        content : "너는 보안 학습 플랫폼의 조수이다. 짧고 정확하게 답하고, 필요하면 '관련 학습 페이지로 이동'을 제안하되 링크는 백엔드가 제공하는 slug를 사용한다."
                }

                const messages = [system, ...history, { role: "user", content: clean }];

                const t0 = Date.now();
                const { text, model, usage } = await chatCompletion({
                        messages,
                });
                const dt = Date.now() - t0;

                await ChatBotMessage.create({
                        userId,
                        threadId: sessionId,
                        role: "user",
                        content: clean,
                });

                await ChatBotMessage.create({
                        userId,
                        threadId: sessionId,
                        role: "assistant",
                        content: text || "",
                        model,
                        responseTimeMs: dt,
                        tokens: usage,
                });

                return { threadId: sessionId, answer: text  || "" };
        }

        /**
         * 히스토리 조회 (UI에서 대화 복원용)
         * @param {Object} p
         * @param {string} p.userId
         * @param {string} p.threadId
         * @param {number} [p.limit=50]
         */
        static async history({ userId, threadId, limit = 50 }){
                if(!userId) throw new Error("Unauthorized");
                if(!threadId) throw new Error("threadId required");

                const docs = await ChatBotMessage.find({ userId, threadId })
                        .sort({ createdAt: -1 })
                        .limit(Math.min(limit, 200))
                        .lean();
                return docs.map((d) => ({
                        role: d.role,
                        content: d.content,
                        createdAt: d.createdAt,
                }));
        }
}