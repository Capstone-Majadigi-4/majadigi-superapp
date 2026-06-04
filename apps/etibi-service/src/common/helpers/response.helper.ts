export class ResponseHelper {
  static success(
    message: string,
    data?: any,
  ) {
    return {
      status: 'success',
      message,
      data,
    };
  }

  static error(
    message: string,
    error = 'BAD_REQUEST',
    code = 400,
  ) {
    return {
      status: 'error',
      message,
      error,
      code,
    };
  }
}