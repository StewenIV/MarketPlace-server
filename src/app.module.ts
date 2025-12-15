import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@db/typeorm.module';
import { UserModule } from '@entities/user/user.module';
import { ProductModule } from '@entities/product/product.module';

@Module({
  imports: [
    TypeOrmModule, 
    UserModule,
    ProductModule]
})
export class AppModule {}
