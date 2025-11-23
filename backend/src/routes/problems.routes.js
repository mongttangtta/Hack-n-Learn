// 문제 관련 라우트
import { Router } from "express";
import { exec } from "child_process";
import util from "util";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Practice from "../models/practice.model.js";
import Problem from "../models/problem.model.js";
import requireLogin from "../middlewares/auth.middleware.js";
import * as problemController from "../controllers/problems.controller.js";
import { validateBody } from "../middlewares/validateQuery.js";
import { analyzeEventLog } from "../utils/ai.client.js";


const router = Router();
/**
 * @swagger
 * tags:
 *   name: Problems
 *   description: 실습 문제(Practice Lab) 관련 API
 */
/**
 * @swagger
 * /api/problems/progress:
 *   get:
 *     summary: 실습 문제 진행 상태 목록 조회
 *     tags: [Problems]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 실습 문제 진행 현황 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       slug:
 *                         type: string
 *                         example: "xss-basic"
 *                       title:
 *                         type: string
 *                         example: "XSS 기초"
 *                       difficulty:
 *                         type: string
 *                         enum: [easy, medium, hard]
 *                         example: "easy"
 *                       result:
 *                         type: string
 *                         enum: [unsolved, success, fail]
 *                         example: "success"
 *                         description: 사용자의 풀이 상태
 *                       answerRate:
 *                         type: number
 *                         example: 0.42
 *                         description: 전체 활성 사용자 중 정답을 맞춘 사용자 비율 (0~1)
 *       401:
 *         description: 인증 실패 (Bearer Token 필요)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 */

/**
 * @swagger
 * /api/problems/{slug}/submit:
 *   post:
 *     summary: 실습 문제 플래그 제출
 *     tags: [Problems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - flag
 *             properties:
 *               flag:
 *                 type: string
 *                 example: FLAG{HacknLearn}
 *                 description: 사용자가 제출하는 문제의 플래그 문자열
 *     responses:
 *       200:
 *         description: 플래그 제출 결과 (정답 여부 및 획득 점수)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     correct:
 *                       type: boolean
 *                       example: true
 *                       description: 정답 여부
 *                     gained:
 *                       type: number
 *                       example: 90
 *                       description: 감점 반영 후 획득 점수
 *                     message:
 *                       type: string
 *                       example: 정답입니다!
 */

/**
 * @swagger
 * /api/problems/{slug}/request-hint:
 *   post:
 *     summary: 단계별 힌트 요청 (여러 개의 힌트가 반환될 수 있음)
 *     tags: [Problems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: 문제 식별용 slug
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stage:
 *                 type: integer
 *                 example: 1
 *                 description: 요청하는 힌트 단계 (1, 2, 3 ...)
 *     responses:
 *       200:
 *         description: 요청한 단계의 힌트 목록 반환 + 패널티 정보 포함
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     hints:
 *                       type: array
 *                       description: 동일 stage에 속한 여러 힌트 목록
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             enum: [text, code]
 *                             example: "code"
 *                           content:
 *                             type: string
 *                             example: "(SELECT substr(flag,1,1) FROM flags WHERE id=1)='F'"
 *                     penaltyApplied:
 *                       type: integer
 *                       example: 10
 *                       description: 이번 요청에서 적용된 패널티
 *                     totalPenalty:
 *                       type: integer
 *                       example: 30
 *                       description: 사용자 누적 패널티
 *                     usedHint:
 *                       type: integer
 *                       example: 2
 *                       description: 지금까지 요청한 힌트 개수
 *                     remainingPotentialScore:
 *                       type: integer
 *                       example: 70
 *                       description: 패널티를 반영한 남은 최대 점수
 *       404:
 *         description: 문제를 찾을 수 없음
 *       500:
 *         description: 서버 내부 오류
 */
/**
 * @swagger
 * /api/problems/{slug}/events:
 *   get:
 *     summary: 실습 컨테이너 이벤트 로그 분석
 *     tags: [Problems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 이벤트 로그 분석 결과 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 analysis:
 *                   type: object
 *                   description: AI 분석 결과
 *                   example:
 *                     summary: "SQL Injection 취약점 탐지 성공"
 *                     steps:
 *                       - "로그인 페이지 접근"
 *                       - "payload: ' OR '1'='1' 사용 탐지"
 *                     score: 95
 *       404:
 *         description: 문제 또는 실행 중인 실습이 존재하지 않거나 이벤트 파일이 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No running practice found for this problem."
 *       500:
 *         description: 서버 내부 오류 (Docker 복사 실패 등)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch event data."
 * 
 * @swagger
 * /api/problems/{slug}:
 *   get:
 *     summary: 실습 문제 상세 조회
 *     tags: [Problems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: 문제 식별용 slug
 *     responses:
 *       200:
 *         description: 문제 상세 정보 반환
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     scenario:
 *                       type: string
 *                       example: >
 *                         당신은 다크웹에서 활동하며... FLAG를 추출해야 한다.
 *                     goals:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - "Blind SQL Injection의 동작 방식 이해"
 *                         - "Boolean-Based Blind SQLi로 데이터 추출"
 *                         - "flags 테이블에서 FLAG 획득"
 *       404:
 *         description: 문제를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Problem not found"
 */

/**
 * @swagger
 * /api/problems/{id}/start-lab:
 *   post:
 *     summary: 실습 환경(Lab) 시작
 *     tags: [Problems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 문제 ID(ObjectId) 또는 slug
 *     responses:
 *       200:
 *         description: 실습 환경이 시작되었거나 이미 실행 중일 때 반환되는 URL/포트 정보
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 url:
 *                   type: string
 *                   example: "https://hacknlearn.site/lab/8123/"
 *                 port:
 *                   type: integer
 *                   example: 8123
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: 문제를 찾을 수 없음
 *       429:
 *         description: 동시 실행 가능한 Lab 개수를 초과함
 *       503:
 *         description: 전체 서버 Lab 리소스가 모두 사용 중
 *       500:
 *         description: Docker 실행 실패 또는 서버 내부 오류
 */
/**
 * @swagger
 * /api/problems/{id}/stop-lab:
 *   post:
 *     summary: 실습 환경(Lab) 종료
 *     tags: [Problems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 문제 ID(ObjectId) 또는 slug
 *     responses:
 *       200:
 *         description: Lab 환경을 성공적으로 종료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: "8123 Lab environment stopped successfully."
 *       404:
 *         description: 실행 중인 Lab 환경을 찾을 수 없음
 *       500:
 *         description: Lab 종료 실패 (docker stop/rm 에러 등)
 */
/**
 * @swagger
 * /api/problems/running-labs:
 *   get:
 *     summary: 실행 중인 Lab 환경 목록 조회
 *     tags: [Problems]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 해당 사용자가 실행 중인 모든 Lab 리스트
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 runningLabs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "68fd0c37fec1b36292efeabc"
 *                       problemId:
 *                         type: string
 *                       containerName:
 *                         type: string
 *                         example: "practice_xss_user_17325920123"
 *                       port:
 *                         type: integer
 *                         example: 8123
 *                       status:
 *                         type: string
 *                         example: "running"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       expiresAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: 서버 내부 오류
 */



const execPromise = util.promisify(exec);

const PORT_RANGE = { min: 8100, max: 8200 };
const usedPorts = new Set();

function getAvailablePort() {
        for (let port = PORT_RANGE.min; port <= PORT_RANGE.max; port++) {
                if (!usedPorts.has(port)) {
                        usedPorts.add(port);
                        return port;
                }
        }
        throw new Error("No available ports");
}

router.post("/:id/start-lab", requireLogin, async( req, res) => {
        try{
                const { id } = req.params;
                const userId = req.user._id
                
                // 1. Problem 찾기 (ObjectId 또는 slug로)
                let problem;
                if (mongoose.Types.ObjectId.isValid(id)) {
                        problem = await Problem.findById(id);
                } else {
                        problem = await Problem.findOne({ slug: id });
                }

                if (!problem) {
                        return res.status(404).json({ 
                                success: false, 
                                message: "Problem not found." 
                        });
                }

                const existing = await Practice.findOne({ userId, problemId: problem._id,  status : 'running' });

                if ( existing ) {
                        return res.json
                        ({
                                success: true,
                                url : `https://hacknlearn.site:${existing.port}`,
                                port: existing.port,
                                expiresAt: existing.expiresAt
                        });
                }


                const runningCount = await Practice.countDocuments({ userId, status : 'running' });
                if( runningCount >= 2) {
                        return res.status(429).json({ message : "You can run up to 2 labs simultaneously." });
                }

                const totalRunnings = await Practice.countDocuments({ status : 'running' });
                if ( totalRunnings >= 5){
                        return res.status(503).json({ message : "All lab environments are currently busy. Please try again later." });
                }

                const port = getAvailablePort();
                const containerName = `practice_${problem.slug}_${userId}_${Date.now()}`;
                const dockerCommand = `docker run -d \
                --name ${containerName} \
                -p ${port}:5000 \
                --memory="128m" \
                --cpus="0.25" \
                --restart=no \
                practice-${problem.slug}:latest`;
    
                try {
                        await execPromise(dockerCommand);
                } catch (dockerError) {
                // Docker 실행 실패 시 포트 반환
                        usedPorts.delete(port);
                        throw dockerError;
                }

                console.log(`Starting container: ${containerName} on port ${port}`);

                const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60분 후 만료
                await Practice.create({
                        userId,
                        problemId: problem._id,
                        containerName,
                        port,
                        status: 'running',
                        createdAt: new Date(),
                        expiresAt,
                });

                res.json({
                        success: true,
                        url : `https://hacknlearn.site/lab/${port}/`,
                        port,
                        expiresAt
                })
        } catch (error){
                console.error("Error starting lab environment:", error);
                res.status(500).json({ message : "Failed to start lab environment." });
        }
});     

router.post("/:id/stop-lab", requireLogin, async( req, res) => { //이것도 수정해야됨
        try {
                const { id } = req.params;
                const userId = req.user._id;

                let problem;
                if (mongoose.Types.ObjectId.isValid(id)) {
                        problem = await Problem.findById(id);
                } else {
                        problem = await Problem.findOne({ slug: id });
                }

                if (!problem) {
                        return res.status(404).json({ 
                                success: false, 
                                message: "Problem not found." 
                        });
                }

                const practice = await Practice.findOne({ userId, problemId: problem._id, status: 'running' });
                if (!practice) return res.status(404).json({ success: false, message: "No running lab environment found." });

                await execPromise(`docker stop ${practice.containerName}`);
                await execPromise(`docker rm ${practice.containerName}`);
                usedPorts.delete(practice.port);

                practice.status = 'stopped';
                practice.stoppedAt = new Date();
                await practice.save();

                res.json({ success: true, message: practice.port + " Lab environment stopped successfully." });
        } catch (error) {
                console.error("Error stopping lab environment:", error);
                res.status(500).json({ message: "Failed to stop lab environment." });
        }
});

router.get("/running-labs", requireLogin, async (req, res) => {
        try {
                const userId = req.user._id;
                const runningLabs = await Practice.find({ userId, status: 'running' });
                res.json({ success: true, runningLabs });
        } catch (error) {
                console.error("Error fetching running labs:", error);
                res.status(500).json({ message: "Failed to fetch running labs." });
        }
});

router.get("/:slug/events", requireLogin, async (req, res) => {
        try {
                const { slug } = req.params;
                const userId = req.user._id;

                const problem = await Problem.findOne({ slug });
                if( !problem ) return res.status(404).json({ success: false, message: "Problem not found." });

                const practice = await Practice.findOne({ 
                        userId, 
                        problemId: problem._id,
                        status : 'running'
                 });
                if( !practice ) return res.status(404).json({ success: false, message: "No running practice found for this problem." });
                 
                const containerPath = "/app/data/events.json"; // 컨테이너 내 이벤트 파일 경로

                const tempDir = `/tmp/hacknlearn/${userId}`;
                const tempPath = path.join( tempDir, `${slug}_events.json` );

                fs.mkdirSync( tempDir, { recursive: true } );

                const copyCmd = `docker cp ${practice.containerName}:${containerPath} ${tempPath}`;
                await execPromise( copyCmd );

                if( !fs.existsSync( tempPath )){
                        return res.status(404).json({ success: false, message: "No event data found." });
                }

                const aiResult = await analyzeEventLog( tempPath );

                try {
                        fs.unlinkSync( tempPath );
                } catch (err) {
                        console.error("Error deleting temp event file:", err);
                }

                res.json({ success: true, analysis: aiResult });
        } catch (error) {
                console.error("Error fetching event data:", error);
                res.status(500).json({ message: "Failed to fetch event data." });
        
        }
});

router.get("/progress" , requireLogin, problemController.getProgressList); //문제 목록
router.get("/:slug",requireLogin, problemController.getProblemDetails); //문제 상세 정보
router.post("/:slug/submit", validateBody('submitFlag'), problemController.submitFlag);
router.post("/:slug/request-hint", validateBody('requestHint'), problemController.requestHint);

export default router;