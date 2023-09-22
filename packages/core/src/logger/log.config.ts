import { DestinationStream, Level, LoggerOptions, StreamEntry } from 'pino';
import pretty, { PrettyOptions } from 'pino-pretty';

export class LogConfig {
  public level: Level;
  public loggerOptions: LoggerOptions;
  public pretty: boolean;
  public saveAllLogs: boolean;
  public saveErrorLogs: boolean;
  public streamOptions: (DestinationStream | StreamEntry)[];

  constructor(props: Partial<LogConfig>) {
    Object.assign(this, {
      level: props?.level || 'info',
      loggerOptions: {},
      pretty: props?.pretty || false,
      saveAllLogs: props?.saveAllLogs || false,
      saveErrorLogs: props?.saveErrorLogs || false,
      streamOptions: [],
    });

    this.buildLoggerOptions();
    this.buildStreamOptions();
  }

  private buildLoggerOptions(): void {
    this.loggerOptions = {
      formatters: {
        level: label => {
          return { level: label.toUpperCase() };
        },
      },
      level: this.level,
    };
  }

  private buildStreamOptions(): void {
    const defaultOptions: PrettyOptions = {
      colorize: false,
      translateTime: `dd-mm-yyyy HH:MM:ss.l o`,
    };

    this.pretty &&
      this.streamOptions.push({
        level: this.level,
        stream: pretty({
          ...defaultOptions,
          colorize: true,
        }),
      });

    this.saveAllLogs &&
      this.streamOptions.push({
        level: 'info',
        stream: pretty({
          ...defaultOptions,
          append: true,
          destination: `logs/all/all.log`,
          mkdir: true,
        }),
      });

    this.saveErrorLogs &&
      this.streamOptions.push({
        level: 'error',
        stream: pretty({
          ...defaultOptions,
          append: true,
          destination: `logs/error/error.log`,
          mkdir: true,
        }),
      });
  }
}
