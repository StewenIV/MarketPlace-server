import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@svtslv/nestjs-ioredis';
import type { Redis } from '@svtslv/nestjs-ioredis';

 
//редис тут очень старый, надо бы его потом обносить 
@Injectable()
export class RedisService {
  constructor(@(InjectRedis() as any) private readonly redis: Redis) {}

  async set(key: string, data: { [k: string]: any }, expire?: number) {
    return expire
      ? await this.redis.set(key, JSON.stringify(data), 'EX', expire)
      : await this.redis.set(key, JSON.stringify(data));
  }

  async get(key: string) {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async del(key: string) {
    return await this.redis.del(key);
  }
}
