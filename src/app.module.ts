// src/app.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ProductModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './auth/auth.api.key';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load .env globally
    ScheduleModule.forRoot(), // Import ScheduleModule
    ProductModule,
  ],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: ApiKeyGuard,  // Apply the guard globally
  //   },
  // ],

})
export class AppModule {}
