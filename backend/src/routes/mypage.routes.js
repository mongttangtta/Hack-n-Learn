// 마이페이지 관련 라우트
import { Router } from "express";
import passport from "passport";
import multer from "multer";
import * as mypageController from "../controllers/mypage.controller.js";
import requireLogin from "../middlewares/auth.middleware.js";


const router = Router();
const upload = multer({ 
        storage: multer.memoryStorage(),
        limits: { fileSize: 2 * 1024 * 1024 }, // 2MB 파일 크기 제한
        fileFilter: (req, file, cb) => {
                const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

                if(!allowed.includes(file.mimetype)) {
                        return cb(new Error("Only image files are allowed (png, jpeg, jpg, webp)"));
                }
                cb(null, true);
        }
}); // 파일 업로드를 위한 multer 미들웨어 설정

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
router.get("/profile", requireLogin, mypageController.getMyProfile);

router.post("/profile-image", requireLogin, upload.single("image"), mypageController.uploadProfileImage);

router.get("/check-nickname", requireLogin, mypageController.checkNickname);
router.post("/nickname", requireLogin, mypageController.updateNickname);
/**
 * @swagger
 * tags:
 *   name: MyPage
 *   description: 마이페이지 (사용자 프로필 및 학습 정보)
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
 *         description: 사용자 프로필, 실전 문제 진행률, 이론 퀴즈 진행률 반환
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
 *                     practice:
 *                       $ref: '#/components/schemas/PracticeProgress'
 *                     quizProgress:
 *                       $ref: '#/components/schemas/QuizProgress'
 *
 *       401:
 *         description: 인증되지 않은 사용자
 *       500:
 *         description: 서버 내부 오류
 */

/**
 * @swagger
 * components:
 *   schemas:
 *
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
 *         lastLogin:
 *           type: string
 *           format: date-time
 *         isProfileComplete:
 *           type: boolean
 *           example: true
 *
 *     PracticeProgress:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           example: 12
 *         successCount:
 *           type: integer
 *           example: 8
 *         successRate:
 *           type: number
 *           example: 66
 *         typeStats:
 *           type: array
 *           description: 실전 문제 파트별 통계(slug 기반)
 *           items:
 *             $ref: '#/components/schemas/PracticeTypeStat'
 *         practiceList:
 *           type: array
 *           description: 최근 실전 풀이 기록(최대 100개)
 *           items:
 *             $ref: '#/components/schemas/PracticeRecord'
 *
 *     PracticeTypeStat:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           example: "sql-injection-basic"
 *         total:
 *           type: integer
 *           example: 3
 *         successCount:
 *           type: integer
 *           example: 2
 *         progress:
 *           type: number
 *           example: 66.67
 *
 *     PracticeRecord:
 *       type: object
 *       properties:
 *         problem:
 *           type: object
 *           description: 문제 원본 정보
 *           properties:
 *             slug:
 *               type: string
 *               example: "sql-injection-basic"
 *             score:
 *               type: integer
 *               example: 100
 *             answerRate:
 *               type: number
 *               example: 0.52
 *             isActive:
 *               type: boolean
 *               example: true
 *         penalty:
 *           type: integer
 *           example: 10
 *         userHints:
 *           type: integer
 *           example: 1
 *         score:
 *           type: integer
 *           example: 90
 *         result:
 *           type: string
 *           enum: [unsolved, success, fail]
 *           example: "success"
 *         solvedAt:
 *           type: string
 *           format: date-time
 *
 *     QuizProgress:
 *       type: object
 *       properties:
 *         summary:
 *           $ref: '#/components/schemas/QuizSummary'
 *         parts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/QuizPartProgress'
 *
 *     QuizSummary:
 *       type: object
 *       properties:
 *         totalQuizzes:
 *           type: integer
 *           example: 60
 *         solvedQuizzes:
 *           type: integer
 *           example: 42
 *         progress:
 *           type: integer
 *           example: 70
 *
 *     QuizPartProgress:
 *       type: object
 *       properties:
 *         techniqueId:
 *           type: string
 *           example: "675084b4a9f0e9d35b5c1e01"
 *         slug:
 *           type: string
 *           example: "sql-injection"
 *         title:
 *           type: string
 *           example: "SQL Injection"
 *         solvedCount:
 *           type: integer
 *           example: 8
 *         totalCount:
 *           type: integer
 *           example: 10
 *         progress:
 *           type: integer
 *           example: 80
 *         status:
 *           type: string
 *           enum: [not_started, in_progress, solved]
 *           example: "in_progress"
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
/**
 * @swagger
 * /api/mypage/profile-image:
 *   post:
 *     summary: 프로필 이미지 업로드 (Cloudflare R2)
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 imageUrl:
 *                   type: string
 *                   example: "https://pub-xxxxxx.r2.dev/abcd1234.png"
 *       400:
 *         description: 파일 누락
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 내부 오류
 */

/**
 * @swagger
 * /api/mypage/check-nickname:
 *   get:
 *     summary: 닉네임 사용 가능 여부 확인
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nickname
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 닉네임 사용 가능 여부 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *                   example: true
 */
/**
 * @swagger
 * /api/mypage/nickname:
 *   post:
 *     summary: 사용자 닉네임 수정
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *                 example: "new_nickname"
 *     responses:
 *       200:
 *         description: 닉네임 변경 성공
 *       400:
 *         description: 잘못된 요청 또는 닉네임 중복
 *       401:
 *         description: 인증 실패
 *       500:
 *         description: 서버 내부 오류
 */

/**
 * @swagger
 * tags:
 *   name: MyPage
 *   description: 마이페이지 (사용자 프로필 및 학습 정보)
 */

/**
 * @swagger
 * /api/mypage/profile:
 *   get:
 *     summary: 사용자 프로필 + 실전 문제 Raw + 퀴즈 Raw 조회
 *     tags: [MyPage]
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: 전체 프로필 및 풀이 기록 데이터 반환
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
 *                       $ref: '#/components/schemas/MyPageFullProfile'
 *                     practice:
 *                       type: array
 *                       description: ProblemPersonal Raw 데이터 리스트
 *                       items:
 *                         $ref: '#/components/schemas/MyPagePracticeRaw'
 *                     quiz:
 *                       type: array
 *                       description: QuizProcess Raw 데이터 리스트
 *                       items:
 *                         $ref: '#/components/schemas/MyPageQuizRaw'
 *
 *       401:
 *         description: 인증 실패 (세션 없음)
 *       500:
 *         description: 서버 내부 오류
 */

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     MyPageFullProfile:
 *       type: object
 *       description: 유저 기본 프로필 정보
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
 *         profileImageUrl:
 *           type: string
 *           example: "https://pub-xxxxxx.r2.dev/abcd123.webp"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         lastLogin:
 *           type: string
 *           format: date-time
 *         isProfileComplete:
 *           type: boolean
 *           example: true
 *
 *     MyPagePracticeRaw:
 *       type: object
 *       description: ProblemPersonal Raw 데이터 (가공 없음)
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         problem:
 *           type: string
 *         penalty:
 *           type: integer
 *           example: 0
 *         userHints:
 *           type: integer
 *           example: 1
 *         score:
 *           type: integer
 *           example: 90
 *         result:
 *           type: string
 *           enum: [unsolved, success, fail]
 *           example: "success"
 *         solvedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     MyPageQuizRaw:
 *       type: object
 *       description: QuizProcess Raw 데이터 (가공 없음)
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         techniqueId:
 *           type: string
 *         quizId:
 *           type: string
 *         status:
 *           type: string
 *           enum: [not_started, in_progress, solved]
 *         lastAnswer:
 *           type: string
 *           nullable: true
 *         lastCorrect:
 *           type: boolean
 *         attempts:
 *           type: integer
 *           example: 3
 *         lastAnsweredAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */



export default router;