module.exports = {
  apps: [
    {
      name: "hacknlearn-server",
      script: "./server.js",  // 또는 "./app.js" (실제 메인 파일명에 맞춰 수정)
      exec_mode: "cluster",
      instances: 1,
      env: {
        NODE_ENV: "production",
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
