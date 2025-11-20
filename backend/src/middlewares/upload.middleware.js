//이미지 전용 업로드 미들웨어
import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.resolve(process.cwd(), "uploads", "profiles");

if(!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, UPLOAD_DIR),
        filename: (req, file, cb) => {
                const ext = path.extname(file.originalname).toLowerCase();
                const safeName = file.originalname.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
                cb(null, `${Date.now()}-${Math.round(Math.random()*1e6)}-${safeName}${ext}`);
        }
});

const fileFilter = (req, file, cb) => {
        const allowed = ["image/jpeg", "image/jpg", "image/png"];
        if(allowed.includes(file.mimetype)){
                return cb(new Error("지원하지 않는 파일 형식입니다. jpg 또는 png만 허용됩니다."), false);
        }
        cb(null, true);
};

const limits = { fileSize : 3 * 1024 * 1024 }; // 3MB

export const profileUpload = multer({ storage, fileFilter, limits }).single("profileImage");