import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path: path.join(__dirname, '.env')});

export const apps = [
  {
    name: "hacknlearn-server",
    script: "./src/server.js",
    exec_mode: "cluster",
    instances: 1,
    env: {
      NODE_ENV: "production",
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      EXPLAIN_MODEL: process.env.EXPLAIN_MODEL,
      EXPLAIN_TIMEOUT_MS: process.env.EXPLAIN_TIMEOUT_MS,
      AI_MAX_TOKENS: process.env.AI_MAX_TOKENS,
      PORT: 3000
    }
  },
  {
    name: "practice-cleaner",
    script: "./src/cron/cleanup.js",
    cron_restart: "*/5 * * * *",
    autorestart: true
  }
];
