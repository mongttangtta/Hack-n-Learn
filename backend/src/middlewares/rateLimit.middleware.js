import rateLimit from "express-rate-limit";

export const chatBotRateLimit = rateLimit({
        windowMs: 1 * 60 * 1000, // 1 minute
        max : Number(process.env.CHAT_RATE_LIMIT_MAX) || 20, // limit each IP to 20 requests per windowMs
        standardHeaders : true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders : false, // Disable the `X-RateLimit-*` headers
        message : {
                success : false,
                message : "요청이 너무 많습니다. 잠시 후에 다시 시도해주세요."
        }
});