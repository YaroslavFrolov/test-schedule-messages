import { Module } from '@nestjs/common';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [],
  providers: [SchedulerService],
  controllers: [SchedulerController],
})
export class SchedulerModule {}
