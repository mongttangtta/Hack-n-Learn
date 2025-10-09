import { Router } from "express";
import multer from "multer";
import * as UserController from "../controllers/user.controller.js";
import requireLogin from "../middlewares/auth.middleware.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/profile", requireLogin, upload.single("image"), UserController.updateMyProfile);
router.get("/profile/image/:id", UserController.getProfileImage);

export default router;