import { Inject, Injectable, OnModuleInit, Scope } from '@nestjs/common';
import pino, { Logger, multistream } from 'pino';
import { LogConfig } from './log.config';
import { ConfigService } from '../config';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class LogService implements OnModuleInit {
  private config: LogConfig;
  @Inject()
  private readonly configService: ConfigService;
  private logger: Logger;

  public onModuleInit(): void {
    this.initializeLogger();
  }

  private formatArguments(...args: any[]): any[] {
    return args.map(arg => {
      arg instanceof Error && (arg = { error: arg.stack });
      return arg;
    });
  }

  private getConfig(): LogConfig {
    return (
      this.config ||
      (this.config = new LogConfig(this.configService.get<LogConfig>('logger')))
    );
  }

  private initializeLogger(): void {
    this.logger = pino(
      this.getConfig().loggerOptions,
      multistream(this.getConfig().streamOptions),
    );
  }

  public setContext(context: string): void {
    this.logger.setBindings({ context });
  }

  public debug(msg: string, ...args: any[]): void {
    this.logger.debug(msg, ...this.formatArguments(...args));
  }

  public error(msg: string, ...args: any[]): void {
    this.logger.error(msg, ...this.formatArguments(...args));
  }

  public fatal(msg: string, ...args: any[]): void {
    this.logger.fatal(msg, ...this.formatArguments(...args));
  }

  public info(msg: string, ...args: any[]): void {
    this.logger.info(msg, ...this.formatArguments(...args));
  }

  public trace(msg: string, ...args: any[]): void {
    this.logger.trace(msg, ...this.formatArguments(...args));
  }

  public warn(msg: string, ...args: any[]): void {
    this.logger.warn(msg, ...this.formatArguments(...args));
  }
}
