import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/user.model.js";
import PasswordReset from "../models/passwordReset.model.js";
import { sendMail} from "../utils/mail.service.js";

export const register = async (id, nickname, password, email) => {
        const existingUser = await User.findOne({ $or: [{ id }, { nickname }, {email}] });
        if (existingUser) {
            throw new Error("id or nickname already in use");
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({ id, nickname, passwordHash, email });
        await user.save();
        return user;
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

export const findIdByEmail = async(email) => {
        const user = await User.findOne({ email });
        if(!user) throw new Error("No user found with this email");

        await sendMail({
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

        const resetUrl = `${process.env.RESET_PASSWORD_URL}/${token}`;

        await sendMail({
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
        

