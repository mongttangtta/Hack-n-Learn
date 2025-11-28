import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
        {
                postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
                parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
                content: { type: String, required: true, trim: true },
                nickname: { type: String, required: true },
                author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
        },
        { timestamps: true }
);

const Comment = mongoose.model("Comment", communitySchema);

export default Comment;
