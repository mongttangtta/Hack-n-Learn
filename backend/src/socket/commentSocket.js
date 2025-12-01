import { WebSocketServer } from "ws";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";

const onlineUsers = new Map(); // userId -> ws

export const initCommentSocket = (server) => {
        const wss = new WebSocketServer({ server, path: "/ws/comments" });

        wss.on("connection", (ws) => {
                console.log("Client connected to comment socket");

                ws.on("message", (message) => {
                        try {
                                const data = JSON.parse(message.toString());

                                //유저 등록
                                if(data.type === "register" && data.userId) {
                                        onlineUsers.set(data.userId, ws);
                                        ws.userId = data.userId;
                                        console.log(`User ${data.userId} registered for comment notifications`);
                                }
                        } catch (error) {
                                console.error("Error parsing message:", error);
                        }                                
                });

                ws.on("close", () => {
                        console.log(`Client disconnected from comment socket`);
                        onlineUsers.delete(ws.userId);
                });
        });
};
        
export const sendCommentNotification = async ({targetUserId, payload}) => {
        const client = onlineUsers.get(targetUserId);
        if(client && client.readyState === 1) {
                client.send(JSON.stringify({
                        type : "comment_notification",
                        title : payload.title || "새 댓글이 있습니다.",
                        body : payload.body || "새 댓글이 달렸습니다.",
                        data : {
                                postId : payload.postId,
                                commentId : payload.commentId
                        }
                }));
                
        }
};