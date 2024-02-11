import {
  Controller,
  Query,
  ParseIntPipe,
  Post,
  Get,
  Delete,
  Body,
  UsePipes,
  Sse,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, map } from 'rxjs';

import { MessageDTO, messageSchema } from './scheduler.dto';
import { SchedulerService } from './scheduler.service';
import { ZodValidationPipe } from './validation.pipe';
import { EXPIRED_MESSAGE_EVENT_NAME } from './constants';

@Controller('api/scheduler')
export class SchedulerController {
  constructor(
    private schedulerService: SchedulerService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(messageSchema))
  async post(@Body() body: MessageDTO): Promise<number> {
    return this.schedulerService.addMessage(body);
  }

  @Delete()
  async delete(@Query('id', ParseIntPipe) id: number): Promise<number> {
    return this.schedulerService.deleteMessage(id);
  }

  @Get()
  async get(): Promise<MessageDTO[]> {
    return this.schedulerService.getExpiredMessages();
  }

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, EXPIRED_MESSAGE_EVENT_NAME).pipe(
      map((message) => ({ data: message }) as MessageEvent),
    );
  }
}
