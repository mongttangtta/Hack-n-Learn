//실습 문제 모델
import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
        slug: { 
                type: String, 
                required: true, 
                unique: true,
                trim: true,
                lowercase: true
        },
        title : { type: String, required: true, trim : true },
        description : { type: String, required: true }, // 문제 설명 (HTML 형식)
        type : {
                 type: String,
                 enum : ["XSS", "OpenRedirection", "SQL Injection", "CSRF", "Directory Traversal", "Command Injection", "File Upload"],
                 required: true,
        },
        difficulty : {
                        type: String,
                        enum : ["easy", "medium", "hard"],
                        required: true,
        },
        score : { type: Number, default: 0, min: 0 },
        flag : { type: String, required: true, select : false }, // 문제 풀이 정답
        answerRate : { type: Number, default: 0, min: 0, max: 1 }, 
        createdBy : { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        isActive : { type: Boolean, default: true },
        hints : [{
                stage : { type: Number, required: true },
                content : { type: String, required: true },
                penalty : { type: Number, default: 0, min: 0 },
        }],
        aiExplain : { type: String, default: "" },
}, { timestamps: true });

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;