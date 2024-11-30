import { ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler/dist/throttler.exception';
import { ExecutionContext } from '@nestjs/common';
import { CONFIG_MESSAGES } from 'src/config/config';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    throw new ThrottlerException(CONFIG_MESSAGES.TooManyRequests);
  }
}
