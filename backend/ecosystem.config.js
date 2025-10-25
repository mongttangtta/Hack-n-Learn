export const apps = [
  {
    name: "hacknlearn-server",
    script: "./src/server.js",
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
];
