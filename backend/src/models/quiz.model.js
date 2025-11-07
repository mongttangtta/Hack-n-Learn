import mongoose from "mongoose";

const QuestionPartSchema = new mongoose.Schema({
        type : { type : String, enum: ["text", "highlight"], required: true },
        content : { type : String, required: true },
}, { _id : false });

const QuizSchema = new mongoose.Schema({
        techniqueId: { type: mongoose.Schema.Types.ObjectId, ref: "Technique", required: true },
        rawQuestion: { type: String, required: true }, // 원문 질문
        questionParts : { type: [QuestionPartSchema], required: true }, // 질문 파트 배열
        choices: { type: [String], default : [] }, // 답안 기입
        correctAnswer: { type: String, required: true }, // 정답
        explanation: { type: String , default: ""},   // 정답 해설
}, { timestamps: true });

const Quiz = mongoose.model("Quiz", QuizSchema);

export default Quiz;