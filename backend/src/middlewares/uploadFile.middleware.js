//파일 전용 업로드 미들웨어
import multer from "multer";

const storage = multer.memoryStorage();

const uploadFile = multer({ storage,
        limits: { fileSize : 50 * 1024 * 1024 } // 50MB
 });

export default uploadFile;