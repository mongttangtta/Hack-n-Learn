import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const UserService = {
  async verifyPassword(userId, plainPassword) {
    const user = await User.findById(userId).select("passwordHash").lean();
    if (!user) throw new Error("사용자를 찾을 수 없습니다.");
    return bcrypt.compare(plainPassword, user.passwordHash);
  },

  async updateProfile(userId, { nickname, imageStream, filename, contentType }) {
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "profiles" });

    const user = await User.findById(userId);
    if (!user) throw new Error("사용자를 찾을 수 없습니다.");

    if (nickname) {
      const existing = await User.findOne({ nickname, _id: { $ne: userId } });
      if (existing) throw new Error("이미 사용 중인 닉네임입니다.");
      user.nickname = nickname;
    }

    if (imageStream) {
      if (user.profileImageId) {
        try {
          await bucket.delete(user.profileImageId);
        } catch (e) {
          console.warn("이전 이미지 삭제 실패:", e.message);
        }
      }

      const uploadStream = bucket.openUploadStream(filename, { contentType });
      await new Promise((resolve, reject) => {
        imageStream
          .pipe(uploadStream)
          .on("error", reject)
          .on("finish", resolve);
      });

      user.profileImageId = uploadStream.id;
    }

    user.updatedAt = new Date();
    await user.save();

    return {
      _id: user._id,
      nickname: user.nickname,
      profileImageId: user.profileImageId,
      tier: user.tier,
      points: user.points,
    };
  },

  async getProfileImage(profileImageId, res) {
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "profiles" });

    const _id = new mongoose.Types.ObjectId(profileImageId);
    const downloadStream = bucket.openDownloadStream(_id);

    downloadStream.on("error", () => res.status(404).send("이미지를 찾을 수 없습니다."));
    downloadStream.pipe(res);
  },
};
export default UserService;