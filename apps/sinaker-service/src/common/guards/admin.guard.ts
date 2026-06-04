import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard
  implements CanActivate
{
  canActivate(
    context:
      ExecutionContext,
  ): boolean {
    const request =
      context
        .switchToHttp()
        .getRequest();

    const role =
      request.headers[
        'x-user-role'
      ];

    if (
      role !== 'admin'
    ) {
      throw new ForbiddenException(
        'Forbidden access',
      );
    }

    return true;
  }
}