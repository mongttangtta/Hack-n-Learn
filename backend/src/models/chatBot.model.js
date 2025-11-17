import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const TokenUsageSchema = new Schema({
        prompt: { type : Number},
        completion: { type :Number },
        total : { type : Number},
}, { _id : false });

const ChatBotMessagesSchema = new Schema({
        userId : { type: Types.ObjectId, ref: "User", index: true },    // 사용자 ID
        threadId : { type : String, required: true, index: true },      // 대화 세션 ID

        role : {
                type : String,
                enum : ["user", "assistant", "system"],
                required : true,
                index: true,
        },
        content : { type : String, required : true },

        model : { type : String},
        responseTimeMs: { type : Number},
        tokens : { type: TokenUsageSchema },

        metadata : { type : Schema.Types.Mixed },
}, { timestamps: true, versionKey: false });

ChatBotMessagesSchema.index({ userId: 1, threadId: 1, createdAt: 1 });

const ChatBotMessage = model("ChatBotMessage", ChatBotMessagesSchema);

export default ChatBotMessage;