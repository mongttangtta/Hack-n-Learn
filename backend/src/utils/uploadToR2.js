import dotenv from "dotenv";
dotenv.config();
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "../utils/r2.client.js";
import { randomUUID } from "crypto";
import sharp from "sharp";

export const uploadToR2 = async (file) => {
        const webpBuffer = await sharp(file.buffer)
                .rotate()
                .webp({ quality: 80 })
                .toBuffer();

        const key = `${randomUUID()}.webp`;        

        const command = new PutObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: key,
                Body: webpBuffer,
                ContentType: "image/webp",
                ACL: 'public-read',
        });

        await r2Client.send(command);

        const imageUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

        return { imageUrl, key };
};

export const deleteFromR2 = async (key) => {
        if(!key) return;

        try {
                const command = new DeleteObjectCommand({
                        Bucket: process.env.R2_BUCKET_NAME,
                        Key: key,
                });

                await r2Client.send(command);
        } catch (error) {
                console.error("Error deleting from R2:", error);
        }
};