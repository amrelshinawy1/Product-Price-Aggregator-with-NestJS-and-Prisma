// src/products/products.module.ts
import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { PrismaModule } from '../prisma/prisma.module'; // Import PrismaModule
import { ProductController } from './products.controller';
import { ExternalApisModule } from 'src/external-apis/external.api.module';

@Module({
  imports: [PrismaModule, ExternalApisModule], // Import PrismaModule
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService], // Export if needed elsewhere
})
export class ProductModule {}
