import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: { login: string; password: string }): { token: string } {
    return this.authService.login(body.login, body.password);
  }

  @Post('verify')
  verify(@Body() { token }: { token: string }): { valid: boolean } {
    const valid = this.authService.verify(token);

    return { valid };
  }
}
