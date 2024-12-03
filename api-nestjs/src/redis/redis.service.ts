import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async setToken(
    userId: number,
    tokenType: string,
    token: string,
    ttl: number,
  ): Promise<void> {
    const key = `${userId}:${tokenType}`;
    await this.redis.set(key, token, 'EX', ttl);
  }

  async getToken(userId: string, tokenType: string): Promise<string | null> {
    const key = `${userId}:${tokenType}`;
    return await this.redis.get(key);
  }

  async deleteToken(userId: string, tokenType: string): Promise<void> {
    const key = `${userId}:${tokenType}`;
    await this.redis.del(key);
  }

  async getByKey(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }
}
