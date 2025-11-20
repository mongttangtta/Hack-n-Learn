//자료실 전용 업로드 유틸
import dotenv from "dotenv";
dotenv.config();
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "../utils/r2.client.js";
import { randomUUID } from "crypto";

export const uploadFileToR2 = async (file) => {
        const key = `${randomUUID()}-${file.originalname}`;

        const command = new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: "public-read"
        });

        await r2Client.send(command);

        return {
                fileUrl : `${process.env.R2_PUBLIC_URL}/${key}`,
                fileKey : key
        };
};

export const deleteFileFromR2 = async (key) => {
        if(!key) return;

        try {
                const command = new DeleteObjectCommand({
                        Bucket: process.env.R2_BUCKET_NAME,
                        Key: key
                });
                await r2Client.send(command);
        } catch (error) {
                console.error("Error deleting file from R2:", error);
        }
};
