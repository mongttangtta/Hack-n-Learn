import * as mypageService from "../services/mypage.service.js";

export const getMyPage = async (req, res) => {
    try {
        const userId = req.session?.user?._id || req.session?.userId;
        if (!userId) {
            return res.status(401).json({ error: "Mypage Unauthorized" });
        }
        const data = await mypageService.getMyPageData(userId);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error fetching my page data:", error);
        return res.status(500).json({ success: false, error: "MyPage Internal Server Error" });
    }
};

export const getMyProfile = async (req, res) => {
    try {
        const userId = req.session?.user?._id || req.session?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }
        const profile = await mypageService.getUserProfile(userId);

        return res.status(200).json({ success: true, data: profile });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const linkGoogleAccount = async (req, res) => {
    try {
        const userId = req.session?.user?._id || req.session?.userId;
        const { id: oauthId, provider, emails} = req.user;
        if (!userId) return res.status(401).json({ message: "Not authenticated" });

        const email = emails?.[0]?.value || `google_${oauthId}@google.com`;
        await mypageService.linkAccount(userId, { provider: "google", oauthId, email });

        return res.redirect("/api/mypage?linked=google");
    } catch (error) {
        console.error("Error linking Google account:", error);
        return res.status(500).json({ message: "Error linking Google account" });
    }
};

export const linkGitHubAccount = async (req, res) => {
    try {
        const userId = req.session?.user?._id || req.session?.userId;
        const { id: oauthId, provider, emails} = req.user;
        if (!userId) return res.status(401).json({ message: "Not authenticated" });

        const email = emails?.[0]?.value || `github_${oauthId}@github.com`;
        await mypageService.linkAccount(userId, { provider: "github", oauthId, email });

        return res.redirect("/api/mypage?linked=github");
    } catch (error) {
        console.error("Error linking GitHub account:", error);
        return res.status(500).json({ message: "Error linking GitHub account" });
    }
};

export const uploadProfileImage = async (req, res) => {
    try {
        const userId = req.session?.user?._id || req.session?.userId;

        if(!userId) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }   
        if(!req.file) {
            return res.status(400).json({ success: false, message: "Image file is required" });
        }

        const imageUrl = await mypageService.updateProfileimage(userId, req.file);

        return res.json({ success: true, imageUrl });
    }catch (error) {
        console.error("Error uploading profile image:", error);
        return res.status(500).json({ success: false, message: "Error uploading profile image" });
    }
};

export const checkNickname = async (req, res) => {
    try {
        const { nickname } = req.query;
        if(!nickname || typeof nickname !== 'string' || nickname.trim().length < 2 || nickname.trim().length > 20) {
            return res.status(400).json({ success: false, message: "Invalid nickname. It must be between 2 and 20 characters." });
        }

        const available = await mypageService.isNicknameAvailable(nickname.trim());

        return res.json({ success: true, available });
    } catch (error) {
        console.error("Error checking nickname availability:", error);
        return res.status(500).json({ success: false, message: "Error checking nickname availability" });
    }
};

export const updateNickname = async (req, res) => {
    try {
        const userId = req.session?.user?._id || req.session?.userId;
        if(!userId) {
            return res.status(401).json({ success: false, message: "Not authenticated" });
        }

        const { nickname } = req.body;

        const updated = await mypageService.updateNickname(userId, nickname.trim());

        if(updated.cooldown){
            return res.status(400).json({ 
                success: false,
                error: "Nickname change cooldown active",
                nextAvailableAt: updated.nextAvailableAt,
                remainHours : updated.remainHours    
            });
        }

        return res.json({ success: true, nickname: updated.nickname });

    } catch (error) {
        console.error("Error updating nickname:", error);
        return res.status(500).json({ success: false, message: "Error updating nickname" });
    }
};