import { Router } from "express";
import * as wrongNoteController from "../controllers/wrongNote.controller.js";
import { requireLogin } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/", requireLogin, wrongNoteController.getWrongNotes); //오답노트 목록 조회

router.delete("/:noteId", requireLogin, wrongNoteController.deleteWrongNote); //오답노트 삭제

/**
 * @swagger
 * /api/wrong-notes:
 *   get:
 *     tags:
 *       - WrongNote
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: number
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rawQuestion:
 *                         type: string
 *                         example: "SQL Injection 공격을 방지하는 방법은?"
 *                       userAnswer:
 *                         type: string
 *                         example: "입력값 검증"
 *                       correctAnswer:
 *                         type: string
 *                         example: "Prepared Statement"
 *                       explanation:
 *                         type: string
 *                         example: "SQL 구문과 파라미터를 분리하여 인젝션을 차단합니다."
 *                       quizId:
 *                         type: string
 *                         example: "675bac3920efaf9a0f093a62"
 *                       techniqueId:
 *                         type: string
 *                         example: "675bac3920efaf9a0f093a11"
 *                       createdAt:
 *                         type: string
 *                         example: "2025-12-01T04:12:03.123Z"
 *       401:
 *         description: 세션이 없어서 인증 실패
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/wrong-notes/{noteId}:
 *   delete:
 *     tags:
 *       - WrongNote
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *         description: 삭제할 WrongNote ID
 *     responses:
 *       200:
 *         description: 삭제 성공
 *       401:
 *         description: 인증 실패 (세션 없음)
 *       403:
 *         description: 삭제 권한 없음
 *       500:
 *         description: 서버 오류
 */


export default router;