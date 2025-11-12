import * as ChatBotController from "../controllers/chatBot.controller.js";
import { chatBotRateLimit } from "../middlewares/rateLimit.middleware.js";
import { requireLogin } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

/**
 * @route POST /api/chatbot/ask
 * @body { message: string, threadId?: string }
 */
router.post("/ask", requireLogin, chatBotRateLimit, ChatBotController.ChatBotController.postAsk);

/**
 * @route GET /api/chatbot/history/:threadId
 */
router.get("/history/:threadId", requireLogin, ChatBotController.ChatBotController.getHistory);


/**
 * @swagger
 * /api/chatbot/ask:
 *   post:
 *     summary: 플로팅 챗봇 질문 전송
 *     tags: [Chatbot]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatAskRequest'
 *     responses:
 *       200:
 *         description: 성공적으로 응답 반환
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatAskResponse'
 *             examples:
 *               firstMessage:
 *                 summary: 첫 대화 시작 (threadId 없음)
 *                 value:
 *                   success: true
 *                   data:
 *                     threadId: "671ee9c31a2bfc1c5e0e5f1b"
 *                     answer: "SQL Injection은 입력값 검증 부족으로 발생합니다."
 *               followUp:
 *                 summary: 기존 threadId 사용
 *                 value:
 *                   success: true
 *                   data:
 *                     threadId: "671ee9c31a2bfc1c5e0e5f1b"
 *                     answer: "Prepared Statement로 방어할 수 있습니다."
 *                     answer: "SQL 인젝션은 입력값 검증 부족으로 발생합니다. 준비되면 'SQL Injection 기초'로 이동해보세요."
 *       400:
 *         description: 유효하지 않은 입력(빈 값, 과도한 길이 등)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalid:
 *                 value: { success: false, error: "유효하지 않은 입력입니다." }
 *       401:
 *         description: 인증 필요(비로그인)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               unauth:
 *                 value: { success: false, error: "로그인이 필요합니다." }
 *       429:
 *         description: 레이트 리미트 초과
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               tooMany:
 *                 value: { success: false, error: "요청이 너무 많습니다. 잠시 후 다시 시도하세요." }
 *       502:
 *         description: AI 서버 지연/오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               aiDown:
 *                 value: { success: false, error: "현재 AI의 도움을 받을 수 없습니다." }
 */

/**
 * @swagger
 * /api/chatbot/history/{threadId}:
 *   get:
 *     summary: 특정 스레드 대화 히스토리 조회
 *     tags: [Chatbot]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: threadId
 *         required: true
 *         schema: { type: string }
 *         description: 스레드 ObjectId(HEX)
 *         example: "671ee9c31a2bfc1c5e0e5f1b"
 *       - in: query
 *         name: limit
 *         required: false
 *         schema: { type: integer, default: 50, minimum: 1, maximum: 200 }
 *         description: 가져올 메시지 최대 개수
 *     responses:
 *       200:
 *         description: 히스토리 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatHistoryResponse'
 *             examples:
 *               ok:
 *                 value:
 *                   success: true
 *                   data:
 *                     messages:
 *                       - { role: "user", content: "XSS가 뭐예요?", createdAt: "2025-11-07T06:00:00.000Z" }
 *                       - { role: "assistant", content: "스크립트 주입으로…", createdAt: "2025-11-07T06:00:01.000Z" }
 *       400:
 *         description: threadId 누락/형식 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               badThread:
 *                 value: { success: false, error: "threadId가 필요합니다." }
 *       401:
 *         description: 인증 필요(비로그인)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               unauth:
 *                 value: { success: false, error: "로그인이 필요합니다." }
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               serverErr:
 *                 value: { success: false, error: "히스토리 조회 중 오류가 발생했습니다." }
 */

export default router;