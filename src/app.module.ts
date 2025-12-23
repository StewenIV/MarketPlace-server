import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@db/typeorm.module';
import { UserModule } from '@entities/user/user.module';
import { ProductModule } from '@entities/product/product.module';
import { RoleModule } from '@entities/role/role.module';
import { AdminModule } from '@entities/admin/admin.module';

@Module({
  imports: [TypeOrmModule, UserModule, ProductModule, RoleModule, AdminModule ],
})
export class AppModule {}
