// 마이페이지 관련 라우트
import { Router } from "express";
import passport from "passport";
import * as mypageController from "../controllers/mypage.controller.js";
import requireLogin from "../middlewares/auth.middleware.js";


const router = Router();

router.get("/", requireLogin, mypageController.getMyPage);

router.get("/link/google", requireLogin, passport.authorize("google", { scope: ["profile","email"] }));

router.get("/link/google/callback",
        requireLogin,
        passport.authorize("google", { failureRedirect: "/api/mypage", failureFlash: false }),
        mypageController.linkGoogleAccount
);

router.get("/link/github", requireLogin, passport.authorize("github", { scope: ["user:email"] }));

router.get("/link/github/callback",
        requireLogin,
        passport.authorize("github", { failureRedirect: "/api/mypage", failureFlash: false }),
        mypageController.linkGitHubAccount
);

/**
 * @swagger
 * tags:
 *   name: MyPage
 *   description: 마이페이지 (사용자 프로필 및 학습 데이터)
 */

/**
 * @swagger
 * /api/mypage:
 *   get:
 *     summary: 로그인한 사용자의 마이페이지 데이터 조회
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 프로필, 학습 진행률, 최근 실습 기록 반환
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
 *                     profile:
 *                       $ref: '#/components/schemas/MyProfile'
 *                     progress:
 *                       $ref: '#/components/schemas/ProgressStats'
 *                     practiceList:
 *                       type: array
 *                       description: 최근 실습 기록 (최대 100개)
 *                       items:
 *                         $ref: '#/components/schemas/PracticeRecord'
 *       401:
 *         description: 인증되지 않은 사용자
 *       500:
 *         description: 서버 내부 오류
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     MyProfile:
 *       type: object
 *       properties:
 *         nickname:
 *           type: string
 *           example: "juno"
 *         tier:
 *           type: string
 *           enum: [bronze, silver, gold, platinum]
 *           example: "silver"
 *         points:
 *           type: integer
 *           example: 1520
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-01-15T10:12:34.000Z"
 *         lastLogin:
 *           type: string
 *           format: date-time
 *           example: "2025-10-10T23:40:00.000Z"
 *         isProfileComplete:
 *           type: boolean
 *           example: true
 *
 *     ProgressStats:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           example: 87
 *         successCount:
 *           type: integer
 *           example: 73
 *         successRate:
 *           type: number
 *           format: float
 *           example: 0.839
 *         typeStats:
 *           type: array
 *           description: 유형별 통계
 *           items:
 *             $ref: '#/components/schemas/TypeStat'
 *
 *     TypeStat:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           example: "SQL Injection"
 *         total:
 *           type: integer
 *           example: 15
 *         successCount:
 *           type: integer
 *           example: 12
 *         progress:
 *           type: number
 *           example: 80.0
 *
 *     PracticeRecord:
 *       type: object
 *       properties:
 *         problem:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               example: "SQL Injection 실습 문제 1"
 *             type:
 *               type: string
 *               example: "SQL Injection"
 *             difficulty:
 *               type: string
 *               example: "중"
 *         result:
 *           type: string
 *           enum: [success, fail]
 *           example: "success"
 *         score:
 *           type: integer
 *           example: 85
 *         usedHint:
 *           type: integer
 *           example: 1
 *         solvedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-09-30T18:42:00.000Z"
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


export default router;