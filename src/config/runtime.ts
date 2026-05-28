const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const apiBaseUrl = trimTrailingSlash(
  import.meta.env.VITE_API_BASE_URL || ''
);

export const buildApiUrl = (path: string) => {
  if (!apiBaseUrl) return path;
  return `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};
