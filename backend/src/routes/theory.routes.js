// 이론 학습 관련 라우트
import express from "express";
import { listTechniques, listLevels, getLevelDetail } from "../controllers/theory.controller.js";
import { postGenerateQuiz, getQuizzesByLevel, postAnswerQuiz, getWrongNotes } from "../controllers/quiz.controller.js";
import { requireLogin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 모든 카테고리(기법) 목록 조회
// GET /api/theory/techniques
router.get("/techniques", requireLogin, listTechniques);

// 카테고리별 레벨 목록 조회 (Form 선택용)
// GET /api/theory/techniques/:techniqueId/levels
router.get("/techniques/:techniqueId/levels", requireLogin, listLevels);

// 레벨별 상세 이론 조회
// GET /api/theory/techniques/:techniqueId/levels/:levelId
router.get("/techniques/:techniqueId/levels/:levelId", requireLogin, getLevelDetail);


// 퀴즈 생성 (최초 요청 시 AI/Preset → DB에 저장)
// POST /api/theory/quiz/generate
router.post("/quiz/generate", requireLogin, postGenerateQuiz);

// 특정 Technique + Level에 대한 퀴즈 목록 조회
// GET /api/theory/quiz/:techniqueId/levels/:levelId
router.get("/quiz/:techniqueId/levels/:levelId", requireLogin, getQuizzesByLevel);


// 퀴즈 정답 제출 및 채점 ( 한 문제 한 문제에 대한 답안 제출 )
// POST /api/theory/quiz/:quizId/answer
router.post("/quiz/:quizId/answer", requireLogin, postAnswerQuiz);

// 오답노트 조회 (필터: techniqueId, levelId)
// GET /api/theory/quiz/:quizId/wrong-notes
router.get("/quiz/:quizId/wrong-notes", requireLogin, getWrongNotes);
/**
 * @swagger
 * tags:
 *   name: Theory
 *   description: 공격 기법 이론 학습 API
 */

/**
 * @swagger
 * /api/theory/techniques:
 *   get:
 *     summary: 카테고리(Technique) 목록 조회
 *     tags: [Theory]
 *     responses:
 *       200:
 *         description: 카테고리 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Technique'
 */

/**
 * @swagger
 * /api/theory/techniques/{techniqueId}/levels:
 *   get:
 *     summary: 특정 Technique의 레벨 목록 조회
 *     tags: [Theory]
 *     parameters:
 *       - in: path
 *         name: techniqueId
 *         required: true
 *         schema:
 *           type: string
 *         description: Technique ID 또는 slug
 *     responses:
 *       200:
 *         description: Technique 정보와 레벨 목록 반환
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
 *                     levels:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/LevelSummary'
 *       404:
 *         description: Technique를 찾을 수 없음
 */

/**
 * @swagger
 * /api/theory/techniques/{techniqueId}/levels/{levelId}:
 *   get:
 *     summary: 특정 Technique의 특정 Level 상세 조회
 *     tags: [Theory]
 *     parameters:
 *       - in: path
 *         name: techniqueId
 *         required: true
 *         schema:
 *           type: string
 *         description: Technique ID 또는 slug
 *       - in: path
 *         name: levelId
 *         required: true
 *         schema:
 *           type: string
 *         description: Level ID
 *     responses:
 *       200:
 *         description: Technique와 Level 상세 정보 반환
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
 *                       $ref: '#/components/schemas/LevelDetail'
 *       404:
 *         description: Technique 또는 Level을 찾을 수 없음
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Technique:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "65f123abcde7890123456789"
 *         title:
 *           type: string
 *           example: "SQL Injection"
 *         slug:
 *           type: string
 *           example: "sql-injection"
 *         description:
 *           type: string
 *           example: "데이터베이스 쿼리를 조작하는 공격 기법"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-26T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-26T10:00:00.000Z"
 *
 *     TechniqueBasic:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "65f123abcde7890123456789"
 *         title:
 *           type: string
 *           example: "SQL Injection"
 *         slug:
 *           type: string
 *           example: "sql-injection"
 *         description:
 *           type: string
 *           example: "데이터베이스 쿼리를 조작하는 공격 기법"
 *
 *     LevelSummary:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "66a111bbb222ccc333ddd444"
 *         order:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "기초 SQL Injection"
 *
 *     LevelDetail:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "66a111bbb222ccc333ddd444"
 *         order:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "기초 SQL Injection"
 *         description:
 *           type: string
 *           example: "WHERE 절 조건 우회를 활용한 공격"
 *         theory:
 *           type: string
 *           example: "SQL Injection은 입력값을 검증하지 않는 경우 발생한다..."
 *         exampleCode:
 *           type: string
 *           example: "SELECT * FROM users WHERE id = '1' OR '1'='1';"
 *         defense:
 *           type: string
 *           example: "Prepared Statement와 입력값 검증을 통해 방어"
 *         imageUrl:
 *           type: string
 *           example: "/uploads/sql-injection-basic.png"
 *         warning:
 *           type: string
 *           example: "[경고] 학습 외 악용 금지"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-26T11:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-26T11:00:00.000Z"
 */

/**
 * @swagger
 * tags:
 *   name: Quiz
 *   description: 학습 퀴즈 API
 */

/**
 * @swagger
 * /api/theory/quiz/generate:
 *   post:
 *     summary: 퀴즈 생성 (최초 요청 시 AI/Preset → DB 저장)
 *     tags: [Quiz]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - techniqueId
 *               - levelId
 *             properties:
 *               techniqueId:
 *                 type: string
 *                 example: "65f123abcde7890123456789"
 *               levelId:
 *                 type: string
 *                 example: "66a111bbb222ccc333ddd444"
 *     responses:
 *       200:
 *         description: 퀴즈 생성 결과
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
 *                       items:
 *                         $ref: '#/components/schemas/Quiz'
 *                     created:
 *                       type: boolean
 *                       example: true
 *                     from:
 *                       type: string
 *                       example: "ai"
 */

/**
 * @swagger
 * /api/theory/quiz/{techniqueId}/levels/{levelId}:
 *   get:
 *     summary: 특정 Technique + Level에 대한 퀴즈 목록 조회
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: techniqueId
 *         required: true
 *         schema:
 *           type: string
 *         description: Technique ID
 *       - in: path
 *         name: levelId
 *         required: true
 *         schema:
 *           type: string
 *         description: Level ID
 *     responses:
 *       200:
 *         description: 퀴즈 목록 반환
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
 *                       items:
 *                         $ref: '#/components/schemas/QuizSummary'
 */

/**
 * @swagger
 * /api/theory/quiz/{quizId}/answer:
 *   post:
 *     summary: 퀴즈 정답 제출 및 채점
 *     tags: [Quiz]
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
 *         description: 채점 결과
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
 *                       example: false
 *                     userAnswer:
 *                       type: integer
 *                       example: 2
 *                     correctAnswer:
 *                       type: integer
 *                       example: 0
 *                     explanation:
 *                       type: string
 *                       example: "SQL Injection은 입력값 검증 부족이 원인입니다."
 */

/**
 * @swagger
 * /api/theory/quiz/wrong-notes:
 *   get:
 *     summary: 오답노트 조회 (필터 가능)
 *     tags: [Quiz]
 *     parameters:
 *       - in: query
 *         name: techniqueId
 *         required: false
 *         schema:
 *           type: string
 *         description: Technique ID 필터
 *       - in: query
 *         name: levelId
 *         required: false
 *         schema:
 *           type: string
 *         description: Level ID 필터
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
 *                   example: true
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
 *                       example: 1
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Quiz:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "670aaa111bbb222ccc333ddd"
 *         techniqueId:
 *           type: string
 *           example: "65f123abcde7890123456789"
 *         levelId:
 *           type: string
 *           example: "66a111bbb222ccc333ddd444"
 *         question:
 *           type: string
 *           example: "SQL Injection의 주요 원인은?"
 *         choices:
 *           type: array
 *           items:
 *             type: string
 *           example: ["입력값 검증 부족", "강력한 비밀번호 사용", "네트워크 방화벽 미설정"]
 *         correctAnswer:
 *           type: integer
 *           example: 0
 *         explanation:
 *           type: string
 *           example: "입력값 검증 부족이 가장 큰 원인입니다."
 *         source:
 *           type: string
 *           example: "ai"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-26T12:00:00Z"
 *
 *     QuizSummary:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "670aaa111bbb222ccc333ddd"
 *         question:
 *           type: string
 *           example: "SQL Injection의 주요 원인은?"
 *         choices:
 *           type: array
 *           items:
 *             type: string
 *           example: ["입력값 검증 부족", "강력한 비밀번호 사용", "네트워크 방화벽 미설정"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-26T12:00:00Z"
 *         source:
 *           type: string
 *           example: "ai"
 *
 *     WrongNote:
 *       type: object
 *       properties:
 *         quizId:
 *           type: string
 *           example: "670aaa111bbb222ccc333ddd"
 *         techniqueId:
 *           type: string
 *           example: "65f123abcde7890123456789"
 *         levelId:
 *           type: string
 *           example: "66a111bbb222ccc333ddd444"
 *         question:
 *           type: string
 *           example: "SQL Injection의 주요 원인은?"
 *         choices:
 *           type: array
 *           items:
 *             type: string
 *           example: ["입력값 검증 부족", "강력한 비밀번호 사용", "네트워크 방화벽 미설정"]
 *         userAnswer:
 *           type: integer
 *           example: 2
 *         correctAnswer:
 *           type: integer
 *           example: 0
 *         explanation:
 *           type: string
 *           example: "입력값 검증 부족이 가장 큰 원인입니다."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-26T12:30:00Z"
 */



export default router;