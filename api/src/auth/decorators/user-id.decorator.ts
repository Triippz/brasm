import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { LOGIN_ACCESS_TOKEN } from '../../tokens/tokens.constants';
import { UserAccessTokenClaims } from '../dtos/auth-token-output.dto';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token =
      request.headers.authorization &&
      request.headers.authorization.split(' ')[1]; // Assuming 'Bearer {token}' format
    if (!token) return null;

    try {
      const payload = jwt.verify(
        LOGIN_ACCESS_TOKEN,
        token,
      ) as UserAccessTokenClaims;
      return payload.id;
    } catch (error) {
      throw new Error('Token validation failed');
    }
  },
);
