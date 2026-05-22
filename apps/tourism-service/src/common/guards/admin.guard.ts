import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard
  implements CanActivate
{
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request =
      context
        .switchToHttp()
        .getRequest();

    const role =
      request.headers[
        'x-user-role'
      ];

    if (!role) {
      throw new UnauthorizedException(
        'Role tidak ditemukan',
      );
    }

    if (role !== 'admin') {
      throw new ForbiddenException(
        'Akses hanya untuk admin',
      );
    }

    return true;
  }
}