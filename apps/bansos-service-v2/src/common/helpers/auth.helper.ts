import { ResponseHelper }
from './response.helper';

export class AuthHelper {
  static isAdmin(
    role: string,
  ) {
    if (role !== 'admin') {
      return ResponseHelper.error(
        'Forbidden access',
        'FORBIDDEN',
        403,
      );
    }

    return null;
  }
}