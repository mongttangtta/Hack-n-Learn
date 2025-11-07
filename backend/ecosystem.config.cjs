const path = require('path');
const dotenv = require('dotenv');

dotenv.config({path: path.join(__dirname, '.env')});

module.exports = {
  apps: [
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
  ]
};
