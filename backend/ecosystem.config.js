export const apps = [
  {
    name: "hacknlearn-server",
    script: "./server.js",
    exec_mode: "cluster",
    instances: 1,
    env: {
      NODE_ENV: "production",
      PORT: 3000
    }
  },
  {
    name: "practice-cleaner",
    script: "./cron/cleanup.js",
    cron_restart: "*/5 * * * *",
    autorestart: true
  }
];
