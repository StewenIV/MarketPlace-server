import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

import { RedisService } from '@services/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
  ) {}

  async setSession(payload: any) {
    const jwt = this.jwtService.sign(payload);
    await this.redis.set(jwt, payload, Number(process.env.JWT_EXPIRES) || 3600);

    return jwt;
  }

  async deleteSession(sessionKey: string) {
    await this.redis.del(sessionKey);
  }
}
