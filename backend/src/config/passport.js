import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/user.model.js";

async function findOrMergeUser({ provider, profile}) {
        const email = profile.emails?.[0]?.value || `${provider}_${profile.id}@${provider}.com`;
        const nickname = profile.displayName || profile.username || `${provider}User`;

        let user = await User.findOne({ email });

        if (user) {
                user.linkedAccounts[provider] = {
                        id: profile.id,
                        email};
                user.oauthId = profile.id;
                user.provider = provider;
                await user.save();
                return user;
        }

        user = new User({
                id: profile.id,
                nickname,
                email,
                passwordHash: "sociallogin",
                role: 'user',
                provider,
                oauthId: profile.id,
                isProfileComplete: !!(nickname && email),
        });
        await user.save();
        return user;
}

passport.use(
        new GoogleStrategy({
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "https://hacknlearn.site/api/auth/google/callback",
        }, async (accessToken, refreshToken, profile, done) => {
                try {
                        if(!profile || !profile.emails) {
                               console.log("[DEBUG] Missing profile info, fetching manually...");
                               const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', { 
                                       headers: {
                                               Authorization: `Bearer ${accessToken}`
                                       }
                               });
                               profile = { 
                                id : data.id,
                                displayName : data.name,
                                emails : [{ value : data.email }]
                               };
                        }
                        const user = await findOrMergeUser({ provider: 'google', profile });
                        return done(null, user);
                } catch (error) {
                        console.error("[Google OAuth error]", error);
                        if (typeof done === "function") return done(error);
                        console.error("⚠️ Done callback missing, passport may have broken context.");
                }
        })
);

passport.use(
        new GitHubStrategy({
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: "/api/auth/github/callback",
        }, async (accessToken, refreshToken, profile, done) => {
                try {
                        const user = await findOrMergeUser({ provider: 'github', profile });
                        return done(null, user);
                } catch (error) {
                        console.error('Github OAuth error: ',error);
                        return done(null, false, {message : 'Github OAuth error' });
                }
        })
);

 passport.serializeUser((user, done) => {
                done(null, user.id);
        });

passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        done(null, user);
});

export const initPassport = () => {
       passport.initialize();
       passport.session();
};

export default passport;