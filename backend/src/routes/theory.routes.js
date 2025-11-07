// 이론 학습 관련 라우트
import express from "express";
import * as quizController from "../controllers/quiz.controller.js";
import { requireLogin } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Quiz
 *     description: 학습 퀴즈 관련 API
 */

/**
 * @swagger
 * /api/theory/quiz/{slug}:
 *   get:
 *     summary: 특정 Technique의 전체 퀴즈 목록 조회
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 해당 기법의 퀴즈 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     technique:
 *                       $ref: '#/components/schemas/TechniqueBasic'
 *                     level:
 *                       $ref: '#/components/schemas/LevelSummary'
 *                     quizzes:
 *                       type: array
 *                       description: 해당 기법의 퀴즈 목록
 *                       items:
 *                         $ref: '#/components/schemas/QuizSummary'
 *     description: |
 *       특정 학습 기법(slug)에 등록된 모든 퀴즈 목록을 반환합니다.
 */

/**
 * @swagger
 * /api/theory/quiz/{quizId}/check:
 *   post:
 *     summary: 퀴즈 정답 제출 및 채점
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *         description: 퀴즈 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userAnswer
 *             properties:
 *               userAnswer:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: 채점 및 점수 결과
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     correct:
 *                       type: boolean
 *                       example: true
 *                     correctAnswer:
 *                       type: integer
 *                       example: 1
 *                     explanation:
 *                       type: string
 *                       example: "Prepared Statement를 사용해야 SQL Injection을 예방할 수 있습니다."
 *                     earned:
 *                       type: integer
 *                       example: 10
 *                     totalPoints:
 *                       type: integer
 *                       example: 150
 *     description: |
 *       사용자가 특정 퀴즈에 대해 정답(userAnswer)을 제출하면 채점 결과와 해설, 점수를 반환합니다.
 */

/**
 * @swagger
 * /api/theory/quiz/{quizId}/wrong-notes:
 *   get:
 *     summary: 오답노트 조회 (기법·레벨별 필터 가능)
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: false
 *         schema:
 *           type: string
 *         description: 특정 퀴즈 ID (선택)
 *       - in: query
 *         name: techniqueId
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: levelId
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: size
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: 오답노트 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WrongNote'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     size:
 *                       type: integer
 *                       example: 20
 *                     total:
 *                       type: integer
 *                       example: 3
 *     description: |
 *       사용자의 오답 기록을 조회합니다.
 *       techniqueId, levelId로 필터링하거나 페이징 파라미터(page, size)를 사용할 수 있습니다.
 */

/**
 * @swagger
 * /api/theory/quiz/{slug}/result-explanation:
 *   post:
 *     summary: AI 종합 해설 생성 (결과보기)
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Technique slug
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user-123"
 *     responses:
 *       200:
 *         description: AI 해설 생성 결과
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "SQL Injection (SQLI) 종합 해설"
 *                     summary:
 *                       type: string
 *                       example: "총 3문항 중 2문항 정답, 오답 1건에 대한 분석 결과입니다."
 *                     focusAreas:
 *                       type: array
 *                       items:
 *                         type: string
 *                     nextSteps:
 *                       type: array
 *                       items:
 *                         type: string
 *                     model:
 *                       type: string
 *                       example: "gpt-4o"
 *                     stats:
 *                       type: object
 *                       properties:
 *                         totalCount:
 *                           type: integer
 *                           example: 3
 *                         correctCount:
 *                           type: integer
 *                           example: 2
 *                         wrongCount:
 *                           type: integer
 *                           example: 1
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     perQuestionResults:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           questionId:
 *                             type: string
 *                           isCorrect:
 *                             type: boolean
 *                           reasonSummary:
 *                             type: string
 *                           mistakeAnalysis:
 *                             type: array
 *                             items: { type: string }
 *                           stepByStepSolution:
 *                             type: array
 *                             items: { type: string }
 *                           learningTips:
 *                             type: string
 *                           confidence:
 *                             type: number
 *     description: |
 *       사용자의 퀴즈 풀이 결과(정답/오답 기록)를 기반으로 AI가 종합 해설을 생성합니다.
 *       각 문항별 분석(reasonSummary, mistakeAnalysis 등)과 레벨별 종합 요약을 제공합니다.
 */


// GET /api/theory/quiz/:slug
router.get("/quiz/:slug", requireLogin, quizController.getQuizzesBySlug);

// 퀴즈 정답 제출 및 채점 ( 한 문제 한 문제에 대한 답안 제출 )
// POST /api/theory/quiz/:quizId/check
router.post("/quiz/:quizId/check", requireLogin, quizController.checkAnswerAndAward);

// 오답노트 조회 (필터: techniqueId, levelId)
// GET /api/theory/quiz/:quizId/wrong-notes
router.get("/quiz/:quizId/wrong-notes", requireLogin, quizController.getWrongNotes);

// 퀴즈 결과 해설 생성 요청
// POST /api/theory/quiz/:slug/result-explanation
router.post("/quiz/:slug/result-explanation", requireLogin, quizController.generateQuizResultExplanation);

export default router;