import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/user.model.js";
import EmailVerify from "../models/emailVerify.model.js";
import PasswordReset from "../models/passwordReset.model.js";
//import PendingSocial from "../models/pending-social.model.js";
import { sendEmail } from "../utils/mail.service.js";

const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const sendVerificationCode = async(email) => {
        const code = String(Math.floor(100000 + Math.random() * 900000));
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

        await EmailVerify.findOneAndUpdate(
                { email },
                { verificationCode: code, expiresAt, verified: false },
                { upsert: true, new: true }
        );

        await sendEmail({
                to: email,
                subject: "Email Verification Code",
                text: `Your verification code is: ${code}`,
                html: `<p>Your verification code is: <strong>${code}</strong></p><p>This code will expire in 5 minutes.</p>`
        });

        return true;
};

export const verifyEmailCode = async(email, code) => {
        const record = await EmailVerify.findOne({ email, verificationCode: code });
        if(!record) throw new Error("Invalid verification code");
        if(record.expiresAt < Date.now()) throw new Error("Verification code expired");

        record.verified = true;
        await record.save();

        return true;
};

export const register = async (id, nickname, password, email) => {
        const verified = await EmailVerify.findOne({ email, verified: true });
        if(!verified) throw new Error("Email not verified");

        if(Date.now() > verified.expiresAt) throw new Error("Verification expired, please verify again");

        const existingUser = await User.findOne({
                $or: [
                        { id },
                                                { nickname: new RegExp(`^${escapeRegex(nickname)}$`, 'i') }, 
                        { email } ] });
        if(existingUser) throw new Error("ID, nickname or email already in use");

        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({ id, nickname, passwordHash, email });
await user.save();

        await EmailVerify.deleteOne({ email });

        return user;
};

export const isNicknameAvailable = async (nickname) => {
        if(!nickname) throw new Error("Nickname is required");
        const exist = await User.exists({
                nickname : new RegExp(`^${escapeRegex(nickname)}$`, 'i')
        });
        return !exist;
};

export const login = async( id, password) => {
        const user = await User.findOne({ id });
        if(!user) throw new Error("can't find user");
        if(!user.isActive) throw new Error("user is deactivated");
        
        const valid = await bcrypt.compare(password, user.passwordHash);
        if(!valid) throw new Error("wrong password");

        user.lastLogin = new Date();
        await user.save();

        return user;
};

export const me = async(userId) => {
        const user = await User.findById(userId);
        if(!user) throw new Error("User not found");
        return user;
};

export const findIdByEmail = async(email) => {
        const user = await User.findOne({ email });
        if(!user) throw new Error("No user found with this email");

        await sendEmail({
                to: email,
                subject: "Your User ID",
                text: `Your user ID is: ${user.id}`,
                html: `<p>Your user ID is: <strong>${user.id}</strong></p>`
        });

        return user.id;
};

export const createPasswordResetToken = async(id, email) => {
        const user = await User.findOne({ id, email });
        if(!user) throw new Error("No user found with this id and email");
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = Date.now() + 3600000; // 1 hour

        await PasswordReset.create({
                userId: user._id,
                token,
                expiresAt
        });

        const resetUrl = `${process.env.RESET_PASSWORD_URL}/change-password?token=${token}`;

        await sendEmail({
                to: email,
                subject: "Password Reset Request",
                text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
                html: `<p>You requested a password reset. Click the link below to reset your password:</p>
                          <a href="${resetUrl}">${resetUrl}</a>
        }`
        });

        return token;
};

export const resetPassword = async(token, newPassword) => {
        const resetRecord = await PasswordReset.findOne({
                token,
                expiresAt : { $gt: Date() }
        });

        if(!resetRecord) throw new Error("Invalid or expired token");

        const user = await User.findById(resetRecord.userId);
        if(!user) throw new Error("User not found");

        user.passwordHash = await bcrypt.hash(newPassword, 10);
        await user.save();

        await PasswordReset.deleteOne({ _id: resetRecord._id });
        
        return true;
};
        