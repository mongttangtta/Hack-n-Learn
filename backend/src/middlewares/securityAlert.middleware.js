const DEFAULT_ALERT_MESSAGE =
  "의심스러운 입력이 감지되었습니다. 입력값을 확인해 주세요.";

const XSS_PATTERN =
  /<script\b|javascript:|onerror\s*=|onload\s*=|onmouseenter\s*=|onfocus\s*=|<iframe\b|<svg\b|document\.cookie|alert\s*\(/i;
const SQLI_PATTERN =
  /\bunion\b[\s\S]{0,40}\bselect\b|\bor\b\s+['"`]?\d+['"`]?\s*=\s*['"`]?\d+|--|\/\*|\bselect\b[\s\S]{0,40}\bfrom\b|\bdrop\b\s+table\b|information_schema|sleep\s*\(|benchmark\s*\(/i;

function collectStringValues(value, values = []) {
  if (typeof value === "string") {
    values.push(value);
    return values;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectStringValues(item, values));
    return values;
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectStringValues(item, values));
  }

  return values;
}

function hasSuspiciousContent(payload) {
  const values = collectStringValues(payload);
  return values.some((value) => XSS_PATTERN.test(value) || SQLI_PATTERN.test(value));
}

export function securityAlert(message = DEFAULT_ALERT_MESSAGE) {
  return (req, res, next) => {
    if (hasSuspiciousContent(req.body)) {
      res.set("X-Security-Alert", message);
    }
    next();
  };
}

export { DEFAULT_ALERT_MESSAGE };
