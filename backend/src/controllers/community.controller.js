import * as communityService from "../services/community.service.js";
import { sendCommentNotification } from "../socket/commentSocket.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import xss from "xss";

export const createPost = async (req, res) => {
        try {
                const data = {
                        type : req.body.type,
                        title : xss(req.body.title),
                        content : xss(req.body.content),
                        author : req.session.userId
                };
                const post = await communityService.createPost(data);
                res.status(201).json(post);
        } catch (error) {
                res.status(500).json({ message: "생성 실패" });
        }
};

export const deletePost = async (req, res) => {
        try {
                const result = await communityService.deletePost(req.params.id, req.session.userId);

                if(!result) return res.status(404).json({ success: false, message: "게시글을 찾을 수 없습니다." });
                if(result === "unauthorized") return res.status(403).json({ success: false, message: "권한이 없습니다." });

                res.json({ success: true, message: "삭제 성공" });
        } catch (error) {
                res.status(500).json({ message: "삭제 실패" });
        }
};

export const updatePost = async (req, res) => {
        try {
                const data = {
                        type : req.body.type,
                        title : xss(req.body.title),
                        content : xss(req.body.content),
                };
                const post = await communityService.updatePost(req.params.id, req.session.userId, data);
                if(!post) return res.status(404).json({ success: false, message: "게시글을 찾을 수 없습니다." });
                if(post === "unauthorized") return res.status(403).json({ success: false, message: "권한이 없습니다." });
                res.json({ success: true, data: post });
        } catch (error) {
                res.status(500).json({ message: "수정 실패" });
        }
};

export const getPosts = async (req, res) => {
        try {
                const { page = 1, limit = 10, type, keyword } = req.query;
                const result = await communityService.getPosts( page, limit, type, keyword );
                res.json({success: true, data: result});
        } catch (error) {
                res.status(500).json({ message: "조회 실패" });
        }
};

export const getPostById = async (req, res) => {
        try {
                const userId = req.session?.userId || null; 
                const post = await communityService.getPostById(req.params.id, userId);
                if(!post) return res.status(404).json({ success: false, message: "게시글을 찾을 수 없습니다." });
                res.json({ success: true, data: post });
        } catch (error) {
                res.status(500).json({ message: "조회 실패" }); 
        }
};

export const createComment = async (req, res) => {
        try {
                const data = {
                        postId : req.params.id,
                        content : xss(req.body.content),
                        author : req.session.userId
                };
                const comment = await communityService.createComment(data);

                const post = await Post.findById(req.params.id);
                if(post && post.author.toString() !== req.session.userId.toString()) {
                        sendCommentNotification({
                                targetUserId: post.author.toString(),
                                payload: {
                                        type: "new_comment",
                                        message: "새 댓글이 달렸습니다.",
                                        postId: post._id,
                                        commentId: comment._id,
                                        content: comment.content,
                                }
                        });
                }
                res.status(201).json({ success: true, data: comment });
        } catch (error) {
                res.status(500).json({ message: "생성 실패" });
        }
};

export const updateComment = async (req, res) => {
        const data = { content : xss(req.body.content) };
        try {
                const comment = await communityService.updateComment(req.params.commentId, req.session.userId, data);

                if(!comment) return res.status(404).json({ success: false, message: "댓글을 찾을 수 없습니다." });
                if(comment === "unauthorized") return res.status(403).json({ success: false, message: "권한이 없습니다." });

                res.json({ success: true, data: comment });
        } catch (error) {
                res.status(500).json({ message: "수정 실패" });
        }
};

export const deleteComment = async (req, res) => {
        try {
                const result = await communityService.deleteComment(req.params.commentId, req.session.userId);

                if(!result) return res.status(404).json({ success: false, message: "댓글을 찾을 수 없습니다." });
                if(result === "unauthorized") return res.status(403).json({ success: false, message: "권한이 없습니다." });

                res.json({ success: true, message: "댓글 삭제 성공" });
        } catch (error) {
                res.status(500).json({ message: "댓글 삭제 실패" });
        }       
};

export const createReply = async (req, res) => {
        try {
                const data = {
                        postId : req.params.id,
                        parentComment: req.params.commentId,
                        content : xss(req.body.content),
                        author : req.session.userId
                };
                const reply = await communityService.createReply(data);
                const parent = await Comment.findById(req.params.commentId);
                if(parent && parent.author.toString() !== req.session.userId.toString()) {
                        sendCommentNotification({
                                targetUserId: parent.author.toString(),
                                payload: {
                                        type: "reply",
                                        message: "새 답글이 달렸습니다.",
                                        postId: req.params.id,
                                        commentId: parent._id,
                                        replyId: reply._id,
                                }
                        });
                }

                res.status(201).json({ success: true, data: reply });
        } catch (error) {
                res.status(500).json({ message: "답글 생성 실패" });
        }
};

export const getCommentsTree = async (req, res) => {
        try {
                const result = await communityService.getCommentsTree(req.params.id);
                res.json({ success: true, data: result });
        } catch (error) {
                res.status(500).json({ message: "댓글 조회 실패" });
        }
};