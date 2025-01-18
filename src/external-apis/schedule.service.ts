// src/scheduler/scheduler.service.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExternalApisService } from './external.api.service';

@Injectable()
export class SchedulerService {
  constructor(private readonly externalApisService: ExternalApisService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    console.log('Starting data aggregation...');
    await this.externalApisService.fetchAndAggregateData();
  }
}
