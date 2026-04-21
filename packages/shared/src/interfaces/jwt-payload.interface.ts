export interface JwtPayload {
  sub: string;
  nik: string;
  name: string;
  iat?: number;
  exp?: number;
}
