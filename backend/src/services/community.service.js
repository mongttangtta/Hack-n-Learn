import Post from "../models/post.model.js";
import PostView from "../models/postView.model.js";
import Comment from "../models/comment.model.js";
import { getPagination } from "../utils/pagination.js";


export const createPost = async (data) => {
        const post = new Post(data);
        return await post.save();
};

export const deletePost = async (id, userId) => {
        const post = await Post.findById(id);
        if(!post) return null;
        if(post.author.toString() !== userId.toString()) return "unauthorized";
        
        await Comment.deleteMany({ postId: id });
        return await Post.findByIdAndDelete(id);
};
export const updatePost = async (id, userId, data) => {
        const post = await Post.findById(id);
        if(!post) return null;
        if(post.author.toString() !== userId.toString()) return "unauthorized";

        return await Post.findByIdAndUpdate(id, data, { new: true });
};

export const getPosts = async (page, limit, type, keyword) => {
        const { skip } = getPagination(page, limit);

        const filter = {};
        if (type) filter.type = type;
        if (keyword) filter.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { content: { $regex: keyword, $options: "i" } }
        ];

        const [total, items] = await Promise.all([
                Post.countDocuments(filter),
                Post.find(filter)
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(limit)
                        .populate("author", "nickname")
                        .populate("type", "name")
        ]);

        return { total, page, limit, totalPages: Math.ceil(total / limit), items };
};


export const getPostById = async (id,userId) => {
        const post = await Post.findById(id).populate("author", "nickname").populate("type", "name");
        if(!post) return null;
        if(userId) {
                const isFirstView = await PostView.findOne({ postId: id, userId });

                if(!isFirstView) {
                        await Post.findByIdAndUpdate(id, { $inc: { views: 1 } });
                        await PostView.create({ postId: id, userId });
                } else {
                        await PostView.updateOne(
                                {
                                        postId: id,
                                        userId: userId
                                },
                                { viewedAt: new Date() },
                        );
                }
                
        }
        return post;
};

export const createComment = async (data) => {
        const comment = new Comment(data);
        return await comment.save();
};

export const deleteComment = async (id, userId) => {
        const comment = await Comment.findById(id);
        if(!comment) return null;
        if(comment.author.toString() !== userId.toString()) return "unauthorized";
        return await Comment.findByIdAndDelete(id);
};

export const updateComment = async (id, userId, data) => {
        const comment = await Comment.findById(id);
        if(!comment) return null;
        if(comment.author.toString() !== userId.toString()) return "unauthorized";
        return await Comment.findByIdAndUpdate(id, data, { new: true });
};

export const createReply = async (data) => {
        const reply = new Comment(data);
        return await reply.save();
};

export const getCommentsTree = async (postId) => {
        const comments = await Comment.find({ postId }).sort({ createdAt: -1 }).populate("author", "nickname").lean();

        const commentMap = {};
        comments.forEach(comment => {
                comment.replies = [];
                commentMap[comment._id] = comment;
        });

        const rootComments = [];

        comments.forEach(comment => {
                if(comment.parentComment) {
                        const parent = commentMap[comment.parentComment];
                        if(parent) parent.replies.push(comment);
                } else {
                        rootComments.push(comment);
                }
        });
        return rootComments;
};