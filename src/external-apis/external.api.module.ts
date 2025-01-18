import { Module } from '@nestjs/common';
import { ExternalApisService } from './external.api.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Import PrismaModule
  providers: [ExternalApisService],
  exports: [ExternalApisService], // Export so other modules can use it
})
export class ExternalApisModule {}