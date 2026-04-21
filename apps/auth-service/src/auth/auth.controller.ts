import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { JwtPayload } from './strategies/jwt.strategy';
import { Buffer } from 'buffer';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    const data = await this.authService.register(dto);
    return {
      success: true,
      message: 'Registrasi berhasil',
      data,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto);
    return {
      status: 'success',
      message: 'Login Berhasil',
      data,
    };
  }

  //not fixed yet
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: any) {
    const data = await this.authService.refreshToken(dto.refresh_token);
    return {
      status: 'success',
      message: 'Token Berhasil Diperbarui',
      data,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Headers('x-user-id') userId: string) {
    await this.authService.logout(userId);
    return {
      status: 'success',
      message: 'Logout berhasil',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString(),
    ) as JwtPayload;

    const data = await this.authService.getMe(payload.sub);
    return {
      status: 'success',
      message: 'Data profil berhasil diambil',
      data,
    };
  }
}
