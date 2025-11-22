// 문의 게시판 관련 라우트
import { Router } from "express";
import PostView from "../models/postView.model.js";
import * as communityController from "../controllers/community.controller.js";
import { requireLogin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/posts", communityController.getPosts);
router.get("/posts/:id", communityController.getPostById);
router.post("/posts", requireLogin, communityController.createPost);
router.delete("/posts/:id", requireLogin, communityController.deletePost);
router.put("/posts/:id", requireLogin, communityController.updatePost);

router.get("/posts/:id/viewed", requireLogin, async (req, res) => {
        const checked = await PostView.exists({
                postId: req.params.id,
                userId: req.session.userId
        });
        res.json({ success: true, viewed : Boolean(checked) });
});

router.get("/posts/:id/comments", communityController.getCommentsTree);
router.post("/posts/:id/comments", requireLogin, communityController.createComment);
router.post("/posts/:id/comments/:commentId/reply", requireLogin, communityController.createReply);
router.delete("/comments/:commentId", requireLogin, communityController.deleteComment);
router.put("/comments/:commentId", requireLogin, communityController.updateComment);

/**
 * @swagger
 * tags:
 *   name: Community
 *   description: 커뮤니티 게시판 API
 */




/**
 * @swagger
 * /api/community/posts:
 *   get:
 *     summary: 게시글 목록 조회
 *     tags: [Community]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: type
 *         schema: { type: string, description: "PostType ObjectId" }
 *       - in: query
 *         name: keyword
 *         schema: { type: string, description: "제목/내용 검색" }
 *     responses:
 *       200:
 *         description: 게시글 목록 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     total: { type: integer }
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     totalPages: { type: integer }
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Post'
 *
 *   post:
 *     summary: 게시글 작성
 *     tags: [Community]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, title, content]
 *             properties:
 *               type: { type: string, example: "65001aaa111bbb222ccc000" }
 *               title: { type: string, example: "로그인 오류 발생" }
 *               content: { type: string, example: "로그인 시 500 에러가 발생합니다." }
 *     responses:
 *       201:
 *         description: 생성된 게시글
 */




/**
 * @swagger
 * /api/community/posts/{id}:
 *   get:
 *     summary: 게시글 상세 조회 (조회수 증가 & 조회 기록 저장)
 *     tags: [Community]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: 게시글 상세 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *
 *   delete:
 *     summary: 게시글 삭제
 *     tags: [Community]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200: { description: 삭제 성공 }
 *
 *   put:
 *     summary: 게시글 수정
 *     tags: [Community]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type: { type: string }
 *               title: { type: string }
 *               content: { type: string }
 *     responses:
 *       200: { description: 수정된 게시글 }
 */



/**
 * @swagger
 * /api/community/posts/{id}/viewed:
 *   get:
 *     summary: 사용자가 이 게시글을 조회했는지 조회 기록 확인
 *     tags: [Community]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200:
 *         description: 조회 여부 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 viewed: { type: boolean }
 */



/**
 * @swagger
 * /api/community/posts/{id}/comments:
 *   get:
 *     summary: 게시글의 전체 댓글/답글 트리 조회
 *     tags: [Community]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200:
 *         description: 댓글 트리 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CommentTree'
 *
 *   post:
 *     summary: 댓글 작성
 *     tags: [Community]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content: { type: string, example: "저도 궁금합니다!" }
 *     responses:
 *       201: { description: 생성된 댓글 }
 */



/**
 * @swagger
 * /api/community/posts/{id}/comments/{commentId}/reply:
 *   post:
 *     summary: 특정 댓글에 답글 작성
 *     tags: [Community]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *       - in: path
 *         name: commentId
 *         schema: { type: string }
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content: { type: string, example: "혹시 콘솔 로그 확인해보셨나요?" }
 *     responses:
 *       201: { description: 생성된 답글 }
 */



/**
 * @swagger
 * /api/community/comments/{commentId}:
 *   put:
 *     summary: 댓글 수정
 *     tags: [Community]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema: { type: string }
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content: { type: string }
 *     responses:
 *       200: { description: 수정된 댓글 }
 *
 *   delete:
 *     summary: 댓글 삭제
 *     tags: [Community]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: 삭제 성공 }
 */



/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         type:
 *           $ref: '#/components/schemas/PostType'
 *         title: { type: string }
 *         content: { type: string }
 *         author:
 *           type: object
 *           properties:
 *             _id: { type: string }
 *             username: { type: string }
 *         views: { type: number }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *
 *     PostType:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         name: { type: string }
 *         active: { type: boolean }
 *
 *     Comment:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         postId: { type: string }
 *         parentComment: { type: string, nullable: true }
 *         content: { type: string }
 *         author:
 *           type: object
 *           properties:
 *             _id: { type: string }
 *             username: { type: string }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *
 *     CommentTree:
 *       allOf:
 *         - $ref: '#/components/schemas/Comment'
 *         - type: object
 *           properties:
 *             replies:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CommentTree'
 *
 *     PostView:
 *       type: object
 *       properties:
 *         postId: { type: string }
 *         userId: { type: string }
 *         viewedAt: { type: string, format: date-time }
 *
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */



export default router;