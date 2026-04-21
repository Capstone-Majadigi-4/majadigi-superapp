import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from "node:crypto";
import { FORCE_AUTH_PATHS } from "src/proxy/routes.config";


export interface JwtPayload {
    sub: string;
    nik: string;
    nama: string;
    iat: number;
    exp: number;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {} 

    use(req: Request, res: Response, next: NextFunction) {
        const requestId = randomUUID();
        req.headers['x-request-id'] = requestId;

        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : null;

        const isForceAuth = FORCE_AUTH_PATHS.some((p) => req.path.startsWith(p));

       if (!token) {
         if (isForceAuth) {
           throw new UnauthorizedException('Token tidak ada atau tidak valid');
         }
         return next();
       }

       try {
        const payload = this.jwtService.verify<JwtPayload>(token, {
            secret: this.configService.get<string>('JWT_SECRET'),
        })

        req.headers['x-user-id'] = payload.sub;
        req.headers['x-user-nik'] = payload.nik;
        req.headers['x-user-nama'] = payload.nama;

        next();
       } catch {
        if (isForceAuth) {
            throw new UnauthorizedException('Token tidak valid atau sudad kadaluarsa');
        }

        next();
       }


    }

}