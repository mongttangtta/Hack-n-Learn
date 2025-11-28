import mongoose from "mongoose";
const QuestionPartSchema = new mongoose.Schema({
        type : { type : String, enum: ["text", "highlight"], required: true },
        content : { type : String, required: true },
}, { _id : false });
const WrongNoteSchema = new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        techniqueId: { type: mongoose.Schema.Types.ObjectId, ref: "Technique", required: true },
        quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },

        rawQuestion: { type: String, required: true },       // 문제 텍스트
        questionParts: { type: [QuestionPartSchema], required: true },
        questionType: {
                type: String,
                enum: ["short", "choice"],
                default: "short",
        },
        choices: {
                type: [
                {
                        label: { type: String, enum: ["A", "B","C"], required: true },
                        content: { type: String, required: true },
                },
                ],
                default: [],
        },
        userAnswer: { type: String, required: true },       // 예: "A" 또는 "Prepared Statement"
        correctAnswer: { type: String, required: true },
        explanation: { type: String, default: "" },
}, { timestamps: true });

const WrongNote = mongoose.model("WrongNote", WrongNoteSchema);
export default WrongNote;