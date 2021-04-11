import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ApiKeyGuard } from './guards/api-key.guard';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { LoggingMiddleware } from './middleware/logging.middleware';

@Module({
  imports: [ConfigModule],
  providers: [{useClass: ApiKeyGuard, provide: APP_GUARD}]
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggingMiddleware).forRoutes(
      '*'
      // {path: 'coffees', method: RequestMethod.GET}
    );
  }
}
