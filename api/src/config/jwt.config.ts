import { registerAs } from '@nestjs/config';
import { int } from './config.utils';
import { JWTConfig } from './config.type';

export default registerAs<JWTConfig>('jwt', () => ({
  accessTokenExpiresInSec: parseInt(
    process.env.JWT_ACCESS_TOKEN_EXP_IN_SEC,
    10,
  ),
  refreshTokenExpiresInSec: parseInt(
    process.env.JWT_REFRESH_TOKEN_EXP_IN_SEC,
    10,
  ),
  unusedRefreshTokenExpiryDays: int(
    process.env.JWT_REFRESH_TOKEN_EXP_IN_SEC,
    30,
  ),
  accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
}));
