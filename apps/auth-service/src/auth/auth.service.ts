import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { RefreshTokensService } from 'src/refresh-tokens/refresh-tokens.service';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly refreshTokensService: RefreshTokensService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async register(dto: RegisterDto) {
        const existing = await this.usersService.findByNik(dto.nik);
        if (existing) {
            throw new ConflictException('NIK sudah terdaftar');
        }

        const password_hash = await bcrypt.hash(dto.password, 10);

        const user = await this.usersService.create({
            nik: dto.nik,
            nama: dto.nama,
            password_hash,
            no_hp: dto.no_hp,
        });
        return {
            id: user.id,
            nik: this.usersService.maskNik(user.nik),
            nama: user.nama,
        };
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByNik(dto.nik);
        if (!user) {
            throw new UnauthorizedException('NIK atau password salah');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash)
        if (!isPasswordValid) {
            throw new UnauthorizedException('NIK atau password salah');
        }

        const payload = {
            sub: user.id,
            nik: user.nik,
            nama: user.nama,
        }
        const access_token = this.jwtService.sign(payload);

        const refresh_token = this.jwtService.sign(payload, {
            expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d') as any,
            secret: this.configService.get<string>('JWT_SECRET'),
        })

        const expires_at = new Date();
        expires_at.setDate(expires_at.getDate() + 7)

        await this.refreshTokensService.revokeByUserId(user.id);
        await this.refreshTokensService.create({
              user_id: user.id,
              token: refresh_token,
              fcm_token: dto.fcm_token,
              expires_at,
            });
        return {
            access_token,
            refresh_token,
            expires_in: 900,
            user: {
                id: user.id,
                nik: this.usersService.maskNik(user.nik),
                nama: user.nama,
            }
        }
    }

    async refreshToken(plainRefreshToken: string) {
        let payload: JwtPayload;
        try {
            payload = this.jwtService.verify<JwtPayload>(plainRefreshToken, {
                secret: this.configService.get<string>('JWT_SECRET'),
            })
        } catch {
            throw new UnauthorizedException('Refresh token tidak valid atau kedaluwarsa')
        }

        const tokenRecord = await this.refreshTokensService.findValidByUserId(
            payload.sub,
            plainRefreshToken,
        )
        if(!tokenRecord) {
            throw new UnauthorizedException('Refresh token tidak ditemukan atau sudah dicabut')
        }

        const newPayload: JwtPayload = {
            sub: payload.sub,
            nik: payload.nik,
            nama: payload.nama,
        }
        const access_token = this.jwtService.sign(newPayload);

        return {
            access_token,
            expires_in: 900,
        }
        }
        

        async logout(user_id: string) {
            await this.refreshTokensService.revokeByUserId(user_id);
        }

        async getMe(user_id: string) {
            const user = await this.usersService.findById(user_id);
            if (!user) {
                throw new UnauthorizedException('User tidak ditemukan');
            }
            return {
                id: user.id,
                nik: this.usersService.maskNik(user.nik),
                nama: user.nama,
                no_hp: user.no_hp,
                is_active: user.is_active,
                created_at: user.created_at,
            }
        }

    }

