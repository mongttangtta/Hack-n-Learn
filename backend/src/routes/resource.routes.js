import { Router } from 'express';
import ResourceController from '../controllers/resource.controller.js';
import requireAdmin from '../middlewares/auth.middleware.js';
import uploadFile from '../middlewares/uploadFile.middleware.js';


const router = Router();

router.post('/upload', requireAdmin, uploadFile.single('file'), ResourceController.upload);
router.get('/list', ResourceController.list);
router.get('/detail/:resourceId', ResourceController.detail);
router.delete('/delete/:resourceId', requireAdmin, ResourceController.delete);

/**
 * @swagger
 * tags:
 *   name: Resource
 *   description: 자료실 관련 API
 */

/**
 * @swagger
 * /api/resources/upload:
 *   post:
 *     summary: 자료실 파일 업로드 (관리자 전용)
 *     tags: [Resource]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "웹 해킹 PDF"
 *               description:
 *                 type: string
 *                 example: "강의 자료입니다."
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 업로드할 파일
 *     responses:
 *       201:
 *         description: 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: "#/components/schemas/Resource"
 *       403:
 *         description: 관리자 권한 없음
 *       400:
 *         description: 요청 오류
 *
 * @swagger
 * /api/resources:
 *   get:
 *     summary: 자료실 목록 조회
 *     tags: [Resource]
 *     responses:
 *       200:
 *         description: 자료 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       fileSize:
 *                         type: number
 *                       createdAt:
 *                         type: string
 * 
 * @swagger
 * /api/resources/{resourceId}:
 *   get:
 *     summary: 자료실 상세 조회
 *     tags: [Resource]
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         required: true
 *         schema:
 *           type: string
 *         description: 자료 ID
 *     responses:
 *       200:
 *         description: 자료 상세 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: "#/components/schemas/Resource"
 *       404:
 *         description: 자료를 찾을 수 없음
 *
 * @swagger
 * /api/resources/{resurceId}:
 *   delete:
 *     summary: 자료 삭제 (관리자 전용)
 *     tags: [Resource]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         required: true
 *         schema:
 *           type: string
 *         description: 자료 ID
 *     responses:
 *       200:
 *         description: 삭제 성공 (R2 파일 + DB 문서 삭제)
 *       403:
 *         description: 관리자 권한 없음
 *       404:
 *         description: 자료를 찾을 수 없음
 */

export default router;