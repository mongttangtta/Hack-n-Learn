import UserService from "../services/user.service.js";
import { Readable } from "stream";

export const updateMyProfile = async (req, res) => {
        try{
                const userId = req.user?._id || req.session?.userId;
                if(!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

                const { nickname, currentPassword} = req.body;

                const file = req.file;

                if(!currentPassword) return res.status(400).json({ success: false, message: "Current password is required" });

                const verified = await UserService.verifyPassword(userId, currentPassword);

                if(!verified) return res.status(403).json({ success: false, message: "Incorrect current password" });

                let imageStream = null, filename = null, contentType = null;

                if(file){
                        imageStream = Readable.from(file.buffer);
                        filename = file.originalname;
                        contentType = file.mimetype;

                        if(!["image/png", "image/jpeg"].includes(contentType)){
                                return res.status(400).json({ success: false, message: "Only PNG and JPEG files are allowed" });
                        }
                        if(file.size > 3 * 1024 * 1024){
                                return res.status(400).json({ success: false, message: "File size exceeds the 3MB limit" });
                        }
                }

                const updated = await UserService.updateProfile(userId, { nickname, imageStream, filename, contentType });

                return res.status(200).json({ success: true, data: updated });
        } catch(err){
                console.error("Error updating profile:", err);
                return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
};

export const getProfileImage = async (req, res) => {
        try{
                const { id } = req.params;
                await UserService.getProfileImage(id, res);
        } catch(err){
                console.error("Error getting profile image:", err);
                return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
};