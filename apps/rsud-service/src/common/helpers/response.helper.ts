export const success = <T>(data: T, message = 'OK', code = 200) => ({
  status: 'success' as const,
  message,
  data,
  code,
});

export const paginate = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
) => ({
  status: 'success' as const,
  message: 'OK',
  data,
  code: 200,
  meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
});
