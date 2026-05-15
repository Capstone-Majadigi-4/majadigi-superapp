import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const key = request.headers['x-admin-key'];
    const expected = this.config.get<string>('ADMIN_SECRET_KEY');

    if (!key || key !== expected) {
      throw new UnauthorizedException('Akses admin tidak diizinkan');
    }
    return true;
  }
}
