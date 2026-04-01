import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrdenesModule } from './ordenes/ordenes.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PaymentsModule } from './payments/payments.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MigrationModule } from './migration/migration.module';

@Module({
  imports: [ProductsModule, PrismaModule, CategoriesModule, UsersModule, AuthModule, OrdenesModule, CloudinaryModule, MigrationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // Esto crea el prefijo en la URL
    }),
    PaymentsModule
  ],
  controllers: [AppController],
  providers: [AppService]
  },
)
export class AppModule {}
