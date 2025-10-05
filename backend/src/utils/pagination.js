// utils/pagination.js
export function getPagination(page = 1, limit = 10) {
  page = Number.isNaN(Number(page)) ? 1 : Math.max(1, parseInt(page, 10));
  limit = Number.isNaN(Number(limit)) ? 10 : Math.max(1, parseInt(limit, 10));
  // enforce reasonable upper bound to avoid abuse
  const MAX_LIMIT = 100;
  limit = Math.min(limit, MAX_LIMIT);

  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
