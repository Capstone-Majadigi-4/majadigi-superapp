export function success<T>(data: T, message = 'OK', code = 200) {
  return { status: 'success', message, data, code };
}

export function paginate<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  message = 'OK',
) {
  return {
    status: 'success',
    message,
    data,
    meta: { total, page, limit, last_page: Math.ceil(total / limit) },
    code: 200,
  };
}
