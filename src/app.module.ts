import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@db/typeorm.module';
import { UserModule } from '@entities/user/user.module';

@Module({
  imports: [
    TypeOrmModule, 
    UserModule],
})
export class AppModule {}
