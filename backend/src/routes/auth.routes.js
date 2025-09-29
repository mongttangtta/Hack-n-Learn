//로그인 페이지
import e, { Router } from "express";
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

router.get("/google", passport.authenticate("google", { scope: ["profile","email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login", failureFlash: true }), (req, res) => {
        //res.json({ message: "Google login success", userId: req.user._id, nickname: req.user.nickname, isProfileComplete: req.user.isProfileComplete });
        res.redirect("/api/main");
});

router.get("/kakao", passport.authenticate("kakao"));
router.get("/kakao/callback", passport.authenticate("kakao", { failureRedirect: "/login", failureFlash: true}), (req, res) => {
        //res.json({ message: "Kakao login success", userId: req.user._id, nickname: req.user.nickname , isProfileComplete: req.user.isProfileComplete });
        res.redirect("/api/main");
});

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/login", failureFlash: true }), (req, res) => {
        //res.json({ message: "GitHub login success", userId: req.user._id, nickname: req.user.nickname , isProfileComplete: req.user.isProfileComplete });
        res.redirect("/api/main");
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
 *   description: 인증 관련 API
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
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "jwt.token.here"
 *       401:
 *         description: 로그인 실패
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 사용자 회원가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: newuser@example.com
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: 회원가입 성공
 */
export default router;