export function withPagination(req, data = []) {
  const url = new URL(req.url);

  let page = parseInt(url.searchParams.get("page") || "1", 10);
  let limit = parseInt(url.searchParams.get("limit") || "10", 10);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 10;

  const start = (page - 1) * limit;
  const end = start + limit;

  const pagiData = data.slice(start, end);
  const totalPage = Math.ceil(data.length / limit);

  return {
    data: pagiData,
    totalPage,
    limit,
    page,
  };
}
