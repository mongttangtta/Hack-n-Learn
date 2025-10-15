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