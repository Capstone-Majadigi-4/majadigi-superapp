export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data?: T;
  code: number;
}

export interface PaginatedResponse<T> {
  status: "success" | "error";
  message: string;
  data: T[];
  code: number;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
