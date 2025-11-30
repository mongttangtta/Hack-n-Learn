//실습 문제 모델
import mongoose from "mongoose";

const ProblemHintSchema = new mongoose.Schema({
        stage : { type: Number, required: true },
        type: {
                type: String,
                enum : ["text", "code"],
                required: true,
                default: "text",
        },
        content : { type: String, required: true },
        penalty : { type: Number, default: 10, min: 10 },
}, { _id : false });

const problemSchema = new mongoose.Schema({
        slug: { 
                type: String, 
                required: true, 
                unique: true,
                trim: true,
                lowercase: true
        },
        score : { type: Number, default: 100, min: 0 },
        flag : { type: String, required: true }, // 문제 풀이 정답
        answerRate : { type: Number, default: 0, min: 0, max: 1 }, 
        isActive : { type: Boolean, default: true },
        hints : {
                type: [ProblemHintSchema],
                default: [],
        },
        title : { type: String, required: true, trim : true },
        difficulty : {
                        type: String,
                        enum : ["easy", "medium", "hard"],
                        required: true,
        },        
        scenario : { type: String, required: true },
        goals : [{ type: String, required: true }],
        imageUrl : { type: String, default: "" },
}, { timestamps: true });

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;