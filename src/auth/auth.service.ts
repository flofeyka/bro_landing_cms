import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly adminLogin: string;
  private readonly adminPassword: string;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.adminLogin = this.configService.get<string>('ADMIN_LOGIN')!;
    this.adminPassword = this.configService.get<string>('ADMIN_PASSWORD')!;
  }

  login(login: string, password: string) {
    if (login !== this.adminLogin || password !== this.adminPassword) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    const payload = { login };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  verify(token: string): boolean {
    try {
      const verified = this.jwtService.verify(token);

      if (!verified) return false;

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
