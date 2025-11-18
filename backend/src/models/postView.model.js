//게시글 조회 기록
import mongoose from "mongoose";

const PostViewSchema = new mongoose.Schema(
        {
                postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
                viewedAt: { type: Date, default: Date.now }
        },
        { timestamps: true }
);

PostViewSchema.index({ postId: 1, userId: 1 }, { unique: true });

const PostView = mongoose.model("PostView", PostViewSchema);

export default PostView;