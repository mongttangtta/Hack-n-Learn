import mongoose, { set } from "mongoose";
import { exec } from "child_process";
import util from "util";
import Practice from "../models/practice.model.js";

const execPromise = util.promisify(exec);

async function cleanupExpiredPractices() {
        await mongoose.connect(process.env.MONGODB_URI);
        const expired = await Practice.find({ status: 'running', expiresAt: { $lt: new Date() } });

        for (const p of expired) {
                try {
                        await execPromise(`docker stop ${p.containerName}`);
                        await execPromise(`docker rm ${p.containerName}`);
                        p.status = 'expired';
                        await p.save();
                        console.log(`Cleaned up expired practice: ${p._id}`);
                } catch (error) {
                        console.error(`Error cleaning up practice ${p._id}:`, error);
                }
        }
        await mongoose.disconnect();
}

setInterval(cleanupExpiredPractices, 5 * 60 * 1000); // 매 5시간마다 실행

cleanupExpiredPractices();