export class ResponseHelper {
  static success(
    message: string,

    data: any = null,
  ) {
    return {
      status: 'success',

      message,

      data,
    };
  }

  static error(
    message: string,

    error: string,

    code: number,
  ) {
    return {
      status: 'error',

      message,

      error,

      code,
    };
  }

  static paginate(
    message: string,

    items: any[],

    meta: {
      page: number;

      limit: number;

      total: number;

      totalPages: number;
    },
  ) {
    return {
      status: 'success',

      message,

      data: {
        items,
      },

      meta,
    };
  }
}
