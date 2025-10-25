// 문제 관련 라우트
import { Router } from "express";
import { exec } from "child_process";
import util from "util";
import Practice from "../models/practice.model.js";
import * as problemController from "../controllers/problems.controller.js";
import requireLogin from "../middlewares/auth.middleware.js";
import { validateQuery, validateBody } from "../middlewares/validateQuery.js";


const router = Router();
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
router.get("/", validateQuery('getProblems'), problemController.listProblems);
router.get("/:id", validateQuery('getProblemById'), problemController.getProblem);

router.post("/:id/start-lab", requireLogin, async( req, res) => {
        try{
                const { id } = req.params;
                const userId = req.user._id;

                const runningCount = await Practice.countDocuments({ userId, status : 'running' });
                if( runningCount >= 2) {
                        return res.status(429).json({ message : "You can run up to 2 labs simultaneously." });
                }

                const totalRunnings = await Practice.countDocuments({ status : 'running' });
                if ( totalRunnings >= 5){
                        return res.status(503).json({ message : "All lab environments are currently busy. Please try again later." });
                }

                const port = getAvailablePort();
                const containerName = `practice_${id}_${userId}_${Date.now()}`;
                const dockerCommand = `docker run -d --name ${containerName} -p ${port}:80 --memory="128m" --cpus="0.25" --restart=no practice-${id}:latest`;

                await execPromise(dockerCommand);

                const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 30분 후 만료
                const practice = await Practice.create({
                        userId,
                        problemId: id,
                        containerName,
                        port,
                        status: 'running',
                        createdAt: new Date(),
                        expiresAt,
                });

                res.json({
                        success: true,
                        url : `http://hacknlearn/problems/${port}`,
                        port,
                        expiresAt
                })
        } catch (error){
                console.error("Error starting lab environment:", error);
                res.status(500).json({ message : "Failed to start lab environment." });
        }
});     

router.post("/:id/stop-lab", requireLogin, async( req, res) => {
        try {
                const { id } = req.params;
                const userId = req.user._id;

                const practice = await Practice.findOne({ userId, problemId: id, status: 'running' });
                if (!practice) return res.status(404).json({ success: false, message: "No running lab environment found." });

                await execPromise(`docker stop ${practice.containerName}`);
                await execPromise(`docker rm ${practice.containerName}`);
                usedPorts.delete(practice.port);

                practice.status = 'stopped';
                practice.stoppedAt = new Date();
                await practice.save();

                res.json({ success: true, message: "Lab environment stopped successfully." });
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




router.post("/:id/submit", validateBody('submitFlag'), problemController.submitFlag);
router.post("/:id/request-hint", validateBody('requestHint'), problemController.requestHint);

// router.get("/", requireLogin, validateQuery('getProblems'), problemController.listProblems);
// router.get("/:id", requireLogin, validateQuery('getProblemById'), problemController.getProblem);
// router.post("/:id/submit", requireLogin, validateBody('submitFlag'), problemController.submitFlag);
// router.post("/:id/request-hint", requireLogin, validateBody('requestHint'), problemController.requestHint);
export default router;