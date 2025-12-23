import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { RedisModule } from '@services/redis/redis.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    NestJwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: {
        expiresIn: Number(process.env.JWT_EXPIRES) * 1000 || 3600000,
      },
    }),
    RedisModule,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, NestJwtModule],
})
export class JwtModule {}
