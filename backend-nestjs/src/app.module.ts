import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RedisModule } from '@nestql/redis';
import { SchedulerModule } from './scheduler/scheduler.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    RedisModule.register([
      {
        name: 'messages',
        url: 'redis://localhost:6379',
      },
      {
        name: 'pubsub',
        url: 'redis://localhost:6379',
      },
    ]),

    SchedulerModule,
  ],
  providers: [],
  controllers: [AppController],
})
export class AppModule {}
