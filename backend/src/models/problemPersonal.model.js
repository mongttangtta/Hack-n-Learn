//실전 문제 풀이 관련 개인별 정보 모델
import mongoose from "mongoose";

const problemPersonalSchema = new mongoose.Schema({
        user : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        problem : { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },

        penalty: { type: Number, default: 0, min: 0 }, // 누적된 패널티 점수
        userHints : { type : Number, default: 0, min: 0 }, // 사용한 힌트 수
        score : { type: Number, default: 0, min: 0 }, // 최종 점수

        result : {
                type: String,
                enum : ["unsolved", "success", "fail"],
                default: "unsolved",
        },
        solvedAt : { type: Date }, // 문제를 푼 시간
}, { timestamps: true });

problemPersonalSchema.index({ user: 1, problem: 1 }, { unique: true });
problemPersonalSchema.index({ solvedAt: -1 });

const ProblemPersonal = mongoose.model("ProblemPersonal", problemPersonalSchema);

export default ProblemPersonal;