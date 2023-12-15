import { STRATEGY_LOCAL } from '../constants/strategy.constant';
import { AuthService } from '../services/auth.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserAccessTokenClaims } from '../dtos/auth-token-output.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, STRATEGY_LOCAL) {
  constructor(private authService: AuthService) {
    // Add option passReqToCallback: true to configure strategy to be request-scoped.
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    email: string,
    password: string,
  ): Promise<UserAccessTokenClaims> {
    const user = await this.authService.authenticateUser(email, password);
    // Passport automatically creates a user object, based on the value we return from the validate() method,
    // and assigns it to the Request object as req.user
    return {
      id: user.id,
      username: user.email,
      role: user.role,
    };
  }
}
