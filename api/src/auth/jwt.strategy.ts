//src/auth/jwt.strategy.ts
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {jwtSecret} from './auth.module';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly prismaService: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtSecret,
        });
    }

    async validate(payload: { userId: number }) {
        const user = await this.prismaService.user.findUnique({
            where: {id: payload.userId},
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
