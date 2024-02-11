import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Redis from 'ioredis';
import { RedisService } from '@nestql/redis';
import { MessageDTO } from './scheduler.dto';
import { EXPIRED_MESSAGE_EVENT_NAME } from './constants';

@Injectable()
export class SchedulerService {
  private readonly messagesClient: Redis;
  private readonly pubsubClient: Redis;

  constructor(
    private readonly redisService: RedisService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.messagesClient = redisService.getClient('messages');
    this.pubsubClient = redisService.getClient('pubsub');

    this.pubsubClient.once('ready', () => {
      this.pubsubClient.config('SET', 'notify-keyspace-events', 'Ex');

      this.pubsubClient.subscribe('__keyevent@0__:expired');

      this.pubsubClient.on('message', async (_, shadowkey) => {
        const id = shadowkey.split(':')[1];
        this._processingMessage(id);
      });
    });
  }

  async addMessage(body: MessageDTO): Promise<number> {
    const id = await this.messagesClient.incr('message');

    await this.messagesClient.hset(msgKey(id), {
      id: id,
      ttl: body.ttl,
      text: body.text,
      isExpired: '0',
    } as MessageDTO);

    await this.messagesClient.set(`shadowkey:${id}`, '', 'EX', body.ttl);

    return id;
  }

  async deleteMessage(id: number): Promise<number> {
    return this.messagesClient.del(msgKey(id));
  }

  async getExpiredMessages(): Promise<MessageDTO[]> {
    // No worries.. this function calls only once at the starting of frontend-app
    const keys = await this.messagesClient.keys('message:*');

    const expiredMessages: MessageDTO[] = [];

    for (const key of keys) {
      const message = await this.messagesClient.hgetall(key);
      if (message.isExpired === '1') {
        expiredMessages.push(message as unknown as MessageDTO);
      }
    }

    return expiredMessages;
  }

  async _processingMessage(id: string) {
    await this.messagesClient.hset(msgKey(id), 'isExpired', '1');
    const message = await this.messagesClient.hgetall(msgKey(id));
    this.eventEmitter.emit(EXPIRED_MESSAGE_EVENT_NAME, message);
  }
}

const msgKey = (id: string | number) => `message:${id}`;
