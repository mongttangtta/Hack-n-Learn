import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
        id: { type: String, required: true, unique: true },
        nickname: { type: String, required: true },
        lastNicknameChangeAt: { type: Date, default: null },
        passwordHash: { type: String },
        email: { type: String, unique: true, sparse: true, required: true },
        provider: { type: String, enum: ['local', 'google', 'github'], default: 'local' },
        oauthId: { type: String, sparse: true }, // OAuth 사용자의 고유 ID 저장
        linkedAccounts: {
                google :{
                        id : { type: String, default: null },
                        email : { type: String, default: null },
                },
                github :{
                        id : { type: String, default: null },
                        email : { type: String, default: null },
                }
        },
        role : { type: String, enum: ['user', 'admin'], default: 'user' },
        tier : { type: String, enum: ['bronze', 'silver', 'gold', 'platinum'], default: 'bronze' },
        titles : { type: [String], default: [] }, // 사용자가 획득한 타이틀 목록
        points : { type: Number, default: 0 },
        createdAt : { type: Date, default: Date.now },
        updatedAt : { type: Date, default: Date.now },
        lastLogin : { type: Date },
        isActive : { type: Boolean, default: true },        
        profileImageUrl : { type: String, default: "https://pub-b23619bb14a741e591c16ef6324e46f.r2.dev/profile-default.png" }, //FE URL
        profileImageKey : { type: String, default: null }, //실제 파일 이름
        isProfileComplete: { type: Boolean, default: true }, // 프로필 완성 여부
}, { timestamps: true });

userSchema.index({ nickname: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

export default mongoose.model("User", userSchema);
        