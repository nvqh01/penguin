import { Global, Module } from '@nestjs/common';
import { LogService } from './log.service';
import { ConfigModule } from '../config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
