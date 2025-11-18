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
 *   description: 커뮤니티 게시판 (사용자 API)
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
 *                     total: { type: integer, example: 2 }
 *                     page: { type: integer, example: 1 }
 *                     limit: { type: integer, example: 10 }
 *                     totalPages: { type: integer, example: 1 }
 *                     items:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/Post' }
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
 *               type: { type: string, description: "PostType ObjectId", example: "65001aaa111bbb222ccc000" }
 *               title: { type: string, example: "로그인 오류 발생" }
 *               content: { type: string, example: "로그인 시 500 에러가 발생합니다." }
 *               secret: { type: boolean, example: false }
 *     responses:
 *       201:
 *         description: 생성된 게시글 반환
 */

/**
 * @swagger
 * /api/community/posts/{id}:
 *   get:
 *     summary: 게시글 상세 조회 (조회수 증가 및 조회 기록 저장)
 *     description: |
 *       - 게시글 상세 정보를 반환합니다.  
 *       - 로그인한 사용자가 처음 조회하는 경우 **views(조회수)가 1 증가**합니다.  
 *       - 또한 사용자의 조회 기록(PostView)이 저장되며, 이후 재조회 시 조회수는 증가하지 않습니다.  
 *       - 비로그인 사용자는 조회 기록이 저장되지 않으며 조회수도 증가하지 않습니다.
 *     tags: [Community]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *         description: 조회할 게시글의 ID
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
 */
/**
 * @swagger
 * /api/community/posts/{id}/viewed:
 *   get:
 *     summary: 특정 게시글을 사용자가 조회했는지 확인
 *     description: |
 *       지정된 게시글을 **현재 로그인한 사용자가 본 적이 있는지 확인**합니다.  
 *       PostView 데이터 기반으로 true/false 반환합니다.
 *     tags: [Community]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *         description: 확인할 게시글 ID
 *     responses:
 *       200:
 *         description: 조회 여부 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 viewed: { type: boolean, example: true }
 */


/**
 * @swagger
 * /api/community/posts/{id}/comments:
 *   get:
 *     summary: 게시글 댓글/답글 트리 조회
 *     tags: [Community]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200:
 *         description: 댓글 트리 구조 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/CommentTree' }
 *
 *   post:
 *     summary: 댓글 작성
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
 *             required: [content]
 *             properties:
 *               content: { type: string, example: "저도 궁금합니다!" }
 *     responses:
 *       201:
 *         description: 생성된 댓글 반환
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
 *       201:
 *         description: 생성된 답글 반환
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
 *               content: { type: string, example: "수정된 댓글 내용입니다." }
 *     responses:
 *       200:
 *         description: 수정된 댓글 반환
 *
 *   delete:
 *     summary: 댓글 삭제
 *     tags: [Community]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200:
 *         description: 삭제 성공 메시지
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         _id: { type: string, example: "652fe1aaa111bbb222ccc333" }
 *         type:
 *           $ref: '#/components/schemas/PostType'
 *         title: { type: string, example: "로그인 오류가 발생합니다" }
 *         content: { type: string, example: "로그인 시 500 에러가 납니다." }
 *         secret: { type: boolean, example: false }
 *         author:
 *           type: object
 *           properties:
 *             _id: { type: string }
 *             username: { type: string }
 *         views:              # 🔥 신규 필드
 *           type: integer
 *           example: 15
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *
 *     Comment:
 *       type: object
 *       properties:
 *         _id: { type: string }
 *         postId: { type: string }
 *         parentComment: { type: string, nullable: true }
 *         content: { type: string, example: "댓글 내용입니다." }
 *         author: { type: string }
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
 *               items: { $ref: '#/components/schemas/CommentTree' }
 * 
 * 
 *     PostView:
 *       type: object
 *       properties:
 *         postId: { type: string, example: "652fe1aaa111bbb222ccc333" }
 *         userId: { type: string, example: "64feabcd1234567890ef1111" }
 *         viewedAt: { type: string, format: date-time }
 *
 *     PostType:
 *       type: object
 *       properties:
 *         _id: { type: string, example: "65001aaa111bbb222ccc000" }
 *         name: { type: string, example: "질문" }
 *         active: { type: boolean, example: true }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


export default router;