import app from "./app.js";
import { connectDB } from "./config/db.js";
import http from "http";
import { initNewsSocket } from "./socket/newsSocket.js";
import { initCommentSocket } from "./socket/commentSocket.js";

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

initNewsSocket(server);
initCommentSocket(server);

connectDB()
  .catch(err => {
    console.log('DB connect fail:', err);
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });