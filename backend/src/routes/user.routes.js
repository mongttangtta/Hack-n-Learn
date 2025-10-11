import { Router } from "express";
import multer from "multer";
import * as UserController from "../controllers/user.controller.js";
import requireLogin from "../middlewares/auth.middleware.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/profile", requireLogin, upload.single("image"), UserController.updateMyProfile);
router.get("/profile/image/:id", UserController.getProfileImage);

/**
 * @swagger
 * tags:
 *   name: User
 *   description: 사용자 정보 수정 및 프로필 관리 API
 */

/**
 * @swagger
 * /api/user/profile:
 *   post:
 *     summary: 사용자 정보 수정 (닉네임 변경 + 프로필 이미지 업로드)
 *     description: |
 *       사용자가 자신의 닉네임을 수정하거나 프로필 이미지를 업로드할 수 있습니다.  
 *       ⚠️ 비밀번호(`currentPassword`) 검증이 반드시 필요하며, 이미지는 `multipart/form-data`로 전송됩니다.  
 *       - 허용 파일 형식: PNG, JPEG  
 *       - 최대 파일 크기: 3MB
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *             properties:
 *               nickname:
 *                 type: string
 *                 example: "newNickname"
 *               currentPassword:
 *                 type: string
 *                 example: "myCurrentPassword123!"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: 프로필 이미지 파일 (png/jpeg, 3MB 이하)
 *     responses:
 *       200:
 *         description: 수정된 사용자 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserProfileResponse'
 *       400:
 *         description: 유효하지 않은 요청 (비밀번호 누락, 잘못된 형식 등)
 *       401:
 *         description: 인증 실패
 *       403:
 *         description: 비밀번호 불일치
 *       500:
 *         description: 서버 내부 오류
 */

/**
 * @swagger
 * /api/user/profile/image/{id}:
 *   get:
 *     summary: 사용자 프로필 이미지 조회
 *     description: GridFS에 저장된 프로필 이미지를 반환합니다.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 이미지의 ObjectId
 *     responses:
 *       200:
 *         description: 이미지 바이너리 응답 (image/png or image/jpeg)
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: 이미지를 찾을 수 없음
 *       500:
 *         description: 서버 내부 오류
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfileResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64feabcd1234567890ef1111"
 *         nickname:
 *           type: string
 *           example: "newNickname"
 *         profileImageId:
 *           type: string
 *           example: "670aaa111bbb222ccc333ddd"
 *         tier:
 *           type: string
 *           enum: [bronze, silver, gold, platinum]
 *           example: "gold"
 *         points:
 *           type: integer
 *           example: 1450
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


export default router;