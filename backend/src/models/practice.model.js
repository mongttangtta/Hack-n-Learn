//실습 영역 결과 모델
import mongoose from 'mongoose';

const practiceSchema = new mongoose.Schema({
        userId : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // 사용자 참조 ID
        problemId : { type: String, required: true }, // 문제 ID
        containerName : { type: String, required: true }, // 도커 컨테이너 이름
        port : { type: Number, required: true }, // 할당된 포트 번호
        status : { type: String, enum: ['running', 'stopped'], required: true }, // 상태
        createdAt : { type: Date, default: Date.now }, // 생성 시간
        expiresAt : { type: Date, required: true }, // 만료 시간
        stoppedAt : { type: Date }, // 중지 시간
        }, { timestamps: true }
);

practiceSchema.index({ userId: 1, problemId: 1 });
practiceSchema.index({ status: 1, expiresAt: 1 });

const Practice = mongoose.model('Practice', practiceSchema);
export default Practice;