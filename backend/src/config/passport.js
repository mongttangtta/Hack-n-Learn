import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User.js";

export const initPassport = () => {
        passport.use(new GoogleStrategy({
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "/api/auth/google/callback",
        }, async (accessToken, refreshToken, profile, done) => {
                try {
                        let user = await User.findOne({ oauthId: profile.id, provider: 'google' });
                        if (!user) {
                                user = new User({
                                        id : profile.id,
                                        nickname: profile.displayName || "GoogleUser",
                                        email: profile.emails && profile.emails[0] ? profile.emails[0].value : undefined,
                                        passwordHash: "sociallogin",
                                        role: 'user',
                                        provider: 'google',
                                        oauthId: profile.id,
                                        isProfileComplete: nickname && email ? true : false,
                                });
                                await user.save();
                        }
                        return done(null, user);
                } catch (error) {
                        console.error('Google OAuth error: ',error);
                        return done(null, false, {message : 'Google OAuth error' });
                }
        }));

        passport.use(new KakaoStrategy({
                clientID: process.env.KAKAO_CLIENT_ID,
                callbackURL: "/api/auth/kakao/callback",
        }, async (accessToken, refreshToken, profile, done) => {
                try {
                        let user = await User.findOne({ oauthId: profile.id, provider: 'kakao' });
                        if (!user) {
                                user = new User({
                                        id : profile.id,
                                        nickname: profile.username || profile.displayName || "KakaoUser",
                                        email: profile.emails && profile.emails[0] ? profile.emails[0].value : undefined,
                                        passwordHash: "sociallogin",
                                        role: 'user',
                                        provider: 'kakao',
                                        oauthId: profile.id,
                                        isProfileComplete: nickname && email ? true : false,
                                });
                                await user.save();
                        }
                        return done(null, user);
                } catch (error) {
                        console.error('Kakao OAuth error: ',error);
                        return done(null, false, {message : 'Kakao OAuth error' });
                }
        }));

        passport.use(new GitHubStrategy({
                clientID: process.env.GITHUB_CLIENT_ID,
                callbackURL: "/api/auth/github/callback",
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }, async (accessToken, refreshToken, profile, done) => {
                try {
                        let user = await User.findOne({ oauthId: profile.id, provider: 'github' });
                        if (!user) {
                                user = new User({
                                        id : profile.id,
                                        nickname: profile.username || "GitHubUser",
                                        email: profile.emails && profile.emails[0] ? profile.emails[0].value : undefined,
                                        passwordHash: "sociallogin",
                                        role: 'user',
                                        provider: 'github',
                                        oauthId: profile.id,
                                        isProfileComplete: nickname && email ? true : false,
                                });
                                await user.save();
                        }
                        return done(null, user);
                } catch (error) {
                        console.error('Github OAuth error: ',error);
                        return done(null, false, {message : 'Github OAuth error' });
                }
        }));

        passport.serializeUser((user, done) => {
                done(null, user.id);
        });

        passport.deserializeUser(async (id, done) => {
                const user = await User.findById(id);
                done(null, user);
        });
};
