//로그인 페이지
import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validateRegister } from "../middlewares/auth.middleware.js";
import * as authService from "../services/auth.service.js";
import passport from "passport";

const router = Router();

router.post("/register" , validateRegister,authController.register);
router.post("/login" , authController.login);
router.post("/logout" , authController.logout);

router.get("/me" , authController.me); // 현재 로그인한 사용자 정보 조회
router.post("/complete-profile" , authController.completeProfile);

router.get("/google", passport.authenticate("google", 
        {
                scope: [
                        "https://www.googleapis.com/auth/userinfo.profile",
                        "https://www.googleapis.com/auth/userinfo.email",
                        "openid"
                ],
                accessType: "offline",
                prompt: "consent",
        }));
router.get(
        "/google/callback", 
        (req, res, next) => {
        // 원본 URL에서 code 파라미터 직접 파싱
        const url = new URL(req.originalUrl, `https://${req.headers.host}`);
        const rawCode = url.searchParams.get("code");
        if(rawCode) {
                console.log("[DEBUG] rawCode (exactly as Google sent):", rawCode);
                req.query.code = decodeURIComponent(rawCode);
                console.log("[DEBUG] decodedCode:", req.query.code);
        }        next();
        next();
}, passport.authenticate("google", { failureRedirect: "/login" }),
        (req, res) => {
        //res.json({ message: "Google login success", userId: req.user._id, nickname: req.user.nickname , isProfileComplete: req.user.isProfileComplete });
        console.log("[DEBUG] Google OAuth success for:", req.user?.email);
        res.redirect("/api/main");
});

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/login", failureFlash: false }), (req, res) => {
        //res.json({ message: "GitHub login success", userId: req.user._id, nickname: req.user.nickname , isProfileComplete: req.user.isProfileComplete });
        res.redirect("/api/main");
});

router.post("/send-verification-code", async (req, res, next) => {
        try{
                const { email } = req.body;
                await authService.sendVerificationCode(email);
                res.json({ message: "Verification code sent" });
        } catch (error) {
                next(error); 
        }
});

router.post("/verify-code", async (req, res, next) => {
        try{
                const { email, code } = req.body;
                await authService.verifyEmailCode(email, code);
                res.json({ message: "Email verified successfully" });
        } catch (error) {
                next(error); 
        }
});

router.post("/find-id", async (req, res, next)=> { 
        try{
                const { email } = req.body;
                const id = await authService.findIdByEmail(email);
                res.json({ message: "User ID found", id });
        }
        catch(error){
                next(error);
        }      
});
router.post("/reset-password", async (req, res, next)=> {
        try{
                const { id, email } = req.body;
                const token = await authService.createPasswordResetToken(id, email);

                res.json({ message: "Password reset email sent if the user exists." });
        }catch(error){
                next(error);
        }
});
router.post("/reset-password/:token", async (req, res, next)=> {
        try{
                const { token } = req.params;
                const { newPassword } = req.body;
                 if (!newPassword || newPassword.length < 6) {
                        return res.status(400).json({ message: "비밀번호는 최소 6자리 이상이어야 합니다" });
                }
                await authService.resetPassword(token, newPassword);
                res.json({ message: "Password has been reset successfully." });
        } catch(error){
                next(error);
        }
});

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 사용자 인증 및 계정 관리 API
 */

/**
 * @swagger
 * /api/auth/send-verification-code:
 *   post:
 *     summary: 회원가입 시 이메일 인증번호 발송
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: 인증번호 발송 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verification code sent
 *       400:
 *         description: 잘못된 이메일 형식 또는 발송 실패
 */

/**
 * @swagger
 * /api/auth/verify-code:
 *   post:
 *     summary: 이메일 인증번호 확인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, code]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: 이메일 인증 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email verified successfully
 *       400:
 *         description: 인증번호 불일치 또는 만료
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 회원가입 (이메일 인증 완료 후)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, nickname, password, email]
 *             properties:
 *               id:
 *                 type: string
 *                 example: juho123
 *               nickname:
 *                 type: string
 *                 example: 사용자
 *               password:
 *                 type: string
 *                 example: "securePassword123!"
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Signup success
 *                 userId:
 *                   type: string
 *                   example: 66f2e6aaa111bbb222ccc333
 *                 nickname:
 *                   type: string
 *                   example: 사용자
 *       400:
 *         description: 이메일 미인증 또는 중복 정보 존재
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 사용자 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, password]
 *             properties:
 *               id:
 *                 type: string
 *                 example: juho123
 *               password:
 *                 type: string
 *                 example: "securePassword123!"
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Login success" }
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id: { type: string, example: "66f2e6aaa111bbb222ccc333" }
 *                     nickname: { type: string, example: "사용자" }
 *                     email: { type: string, example: "user@example.com" }
 *                     isProfileComplete: { type: boolean, example: true }
 *       401:
 *         description: 아이디 또는 비밀번호 불일치
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: 로그아웃
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logout success
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: 현재 로그인한 사용자 정보 조회
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 현재 사용자 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id: { type: string, example: "66f2e6aaa111bbb222ccc333" }
 *                     nickname: { type: string, example: "사용자" }
 *                     email: { type: string, example: "user@example.com" }
 *                     isProfileComplete: { type: boolean, example: true }
 */

/**
 * @swagger
 * /api/auth/complete-profile:
 *   post:
 *     summary: 프로필 정보 보완 (소셜 로그인 사용자의 추가 정보 입력)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname: { type: string, example: "사용자" }
 *               email: { type: string, example: "user@example.com" }
 *     responses:
 *       200:
 *         description: 프로필 완료 처리
 *       400:
 *         description: 잘못된 요청
 */

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: 구글 로그인 요청
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Google 인증 페이지로 리다이렉트
 *
 * /api/auth/google/callback:
 *   get:
 *     summary: 구글 로그인 콜백
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: 인증 완료 후 메인 페이지로 리다이렉트
 */

/**
 * @swagger
 * /api/auth/github:
 *   get:
 *     summary: 깃허브 로그인 요청
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: GitHub 인증 페이지로 리다이렉트
 *
 * /api/auth/github/callback:
 *   get:
 *     summary: 깃허브 로그인 콜백
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: 인증 완료 후 메인 페이지로 리다이렉트
 */

/**
 * @swagger
 * /api/auth/find-id:
 *   post:
 *     summary: 이메일로 사용자 ID 찾기
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: 사용자 ID 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: "User ID found" }
 *                 id: { type: string, example: "juho123" }
 *       404:
 *         description: 이메일에 해당하는 사용자를 찾을 수 없음
 */

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: 비밀번호 재설정 메일 발송
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, email]
 *             properties:
 *               id:
 *                 type: string
 *                 example: juho123
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: 비밀번호 재설정 메일 발송 성공
 *       404:
 *         description: 해당 계정을 찾을 수 없음
 */

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: 비밀번호 재설정
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [newPassword]
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: "newStrongPassword!"
 *     responses:
 *       200:
 *         description: 비밀번호 변경 성공
 *       400:
 *         description: 비밀번호가 너무 짧거나 형식 오류
 *       404:
 *         description: 유효하지 않은 토큰
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


export default router;