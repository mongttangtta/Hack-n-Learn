import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
        {
                type: { type: mongoose.Schema.Types.ObjectId, ref: "PostType", required: true },
                title: { type: String, required: true , trim: true },
                content: { type: String, required: true },
                author : { type : mongoose.Schema.Types.ObjectId, ref: "User", required: true },
                nickname : { type : String },
                views: { type: Number, default: 0 },
        },
        { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;
