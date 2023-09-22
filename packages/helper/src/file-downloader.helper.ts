import axios, { AxiosProxyConfig, AxiosRequestConfig } from 'axios';
import { outputFileSync } from 'fs-extra';

interface CloudFlareStorage {
  type: 'cloud_flare_storage';
  bucket?: string;
  key: string;
}

interface DiskStorage {
  type: 'disk_storage';
  path: string;
}

type FileStorage = CloudFlareStorage | DiskStorage;

interface FileDownloaderConfig {
  requestConfig: AxiosRequestConfig;
  storages: FileStorage[];
  proxy?: string;
}

export class FileDownloader {
  constructor(private config: FileDownloaderConfig) {}

  private buildProxyConfig(proxy: string): AxiosProxyConfig {
    const [host, port, username, password] = proxy.split(':');

    const proxyConfig: AxiosProxyConfig = {
      protocol: 'http',
      host,
      port: Number(port),
      auth: {
        username,
        password,
      },
    };

    return proxyConfig;
  }

  public async download(): Promise<void> {
    const { requestConfig, storages, proxy } = this.config;
    proxy && (requestConfig.proxy = this.buildProxyConfig(proxy));

    const response = await axios.request({
      responseType: 'arraybuffer',
      timeout: 60_000,
      ...requestConfig,
    });

    const binData = Buffer.from(response.data, 'binary');

    await Promise.all(
      storages.map(async storage => {
        storage.type === 'cloud_flare_storage' &&
          console.log('CloudFlare Storage');

        storage.type === 'disk_storage' &&
          outputFileSync(storage.path, binData, 'utf8');
      }),
    );
  }
}
