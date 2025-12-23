import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@services/auth/auth.module';
import { RedisModule } from '@services/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule, RedisModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
