import {
  ApiResponse,
  PaginatedResponse,
} from "../interfaces/api-response.interface";

export const success = <T>(
  data: T,
  message = "OK",
  code = 200,
): ApiResponse<T> => ({
  status: "success",
  message,
  data,
  code,
});

export const paginate = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResponse<T> => ({
  status: "success",
  message: "OK",
  data,
  code: 200,
  meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
});
