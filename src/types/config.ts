export interface AppConfig {
  webAddress: string;
  hostname: string;
  gaKey?: string;
  emailContact?: string;
  maxUploadSize?: string;
  purgeTime?: string;
  sampleToken?: string;
  sampleToken2?: string;
}

export interface DownloadConfig extends AppConfig {
  filename: string;
  contentType: string;
  contentLength: string;
  downloadUrl: string;
  previewType?: 'image' | 'video' | 'audio' | 'markdown' | 'code';
}

declare global {
  // eslint-disable-next-line no-var
  var __CONFIG__: AppConfig | DownloadConfig;
}

export function getConfig<T extends AppConfig = AppConfig>(): T {
  return (globalThis.__CONFIG__ || {
    webAddress: 'https://transfer.sh/',
    hostname: 'transfer.sh',
  }) as T;
}
