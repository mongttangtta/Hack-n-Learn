import dotenv from "dotenv";
dotenv.config();

export const apps = [
  {
    name: "hacknlearn-server",
    script: "./src/server.js",
    exec_mode: "cluster",
    instances: 1,
    env: {
      NODE_ENV: "production",
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      EXPLAIN_MODEL: "gpt-5",
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
