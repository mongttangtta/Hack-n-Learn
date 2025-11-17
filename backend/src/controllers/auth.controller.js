import * as authService from '../services/auth.service.js';
import User from '../models/user.model.js';

export const register = async (req, res, next) => {
        try{
                const { id, nickname, password, email } = req.body;
                if (!id || !nickname || !password || !email) {
                        return res.status(400).json({ message: "id, nickname, email and password are required" });
                }
                const user = await authService.register(id, nickname, password, email);
                req.session.userId = user._id;
                res.status(201).json({ message: "Signup success", userId: user._id, nickname: user.nickname });
        } catch (error) {
                next(error);
        }
};

export const login = async (req, res, next) => {
        try {
                const { id, password } = req.body;
                if (!id || !password) {
                        return res.status(400).json({ message: "id and password are required" });
                }
                const user = await authService.login(id, password);
                req.session.userId = user._id;

                res.clearCookie('guestThreadId');
                res.json({ message: "Login success", userId: user._id, nickname: user.nickname, tier: user.tier });
        } catch (error) {
                next(error);

        }
};

export const logout = (req, res, next) => {
        try{
                if(!req.session.userId) {
                        return res.status(400).json({ message: "Not logged in" });
                }
                req.session.destroy((err) => {
                        if(err) return next(err);
                        res.clearCookie('connect.sid');
                        res.json({ message: "Logout success" });
                });
        } catch (error) {
                next(error);
        }
};

export const checkNickname = async (req, res, next) => {
        try{
                const nickname = req.body.nickname;
                const available = await authService.isNicknameAvailable(nickname);
                res.json({ available });
        } catch (error) {
                next(error);    
        }
};

export const me = async (req, res, next) => {
        try {
                if (!req.session.userId) {
                        return res.status(401).json({ message: "Not authenticated" });
                }
                const user = await authService.me(req.session.userId);
                if(!user) {
                        return res.status(404).json({ message: "User not found" });
                }
                res.json({ message: " Authenticated User ", data : user });
        } catch (error) {
                next(error);
        }
};

export const completeProfile = async (req, res, next) => {
        try {
                const userId = req.session.userId;
                const { nickname, email } = req.body;
                if(!nickname || !email) {
                        return res.status(400).json({ message: "Nickname is required" });
                }

                const user = await User.findById(userId);
                if(!user) {
                        return res.status(404).json({ message: "User not found" });
                }

                user.nickname = nickname;
                user.email = email;                
                user.isProfileComplete = true;
                await user.save();

                res.json({ message: "Profile completed", userId: user._id, nickname: user.nickname, email: user.email });
        } catch (error) {
                next(error);
        }
};