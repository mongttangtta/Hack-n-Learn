const trimTrailingSlash = (value) => String(value || "").replace(/\/+$/, "");

export const frontendUrl = trimTrailingSlash(
  process.env.FRONTEND_URL || "https://hacknlearn.site"
);

export const apiBaseUrl = trimTrailingSlash(
  process.env.API_BASE_URL || frontendUrl
);

export const labBaseUrl = trimTrailingSlash(
  process.env.LAB_BASE_URL || frontendUrl
);

export const corsOrigins = Array.from(
  new Set(
    (process.env.CORS_ORIGINS ||
      [frontendUrl, "http://localhost:5173", "http://127.0.0.1:5173"].join(","))
      .split(",")
      .map((origin) => trimTrailingSlash(origin.trim()))
      .filter(Boolean)
  )
);

export const authSuccessRedirectUrl = frontendUrl;
export const authFailureRedirectUrl = `${frontendUrl}/login`;

export const getMypageLinkedRedirectUrl = (provider) =>
  `${frontendUrl}/mypage?linked=${provider}`;

export const buildLabUrl = (port) => `${labBaseUrl}/lab/${port}/`;
