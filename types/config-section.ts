// TS types for elements on the Config pages

// for dropdown
export interface SocialHandleDropdownItem {
  icon: string;
  platform: string;
  key: string;
}

export type FieldUpdaterFunc = (args: UpdateArgs) => void;

export interface UpdateArgs {
  value: any;
  fieldName?: string;
  path?: string;
}

export interface ApiPostArgs {
  apiPath: string;
  data: object;
  onSuccess?: (arg: any) => void;
  onError?: (arg: any) => void;
}

export interface ConfigDirectoryFields {
  enabled: boolean;
  instanceUrl: string;
}

export interface ConfigInstanceDetailsFields {
  extraPageContent: string;
  logo: string;
  name: string;
  nsfw: boolean;
  socialHandles: SocialHandle[];
  streamTitle: string;
  summary: string;
  tags: string[];
  title: string;
}

export type CpuUsageLevel = 1 | 2 | 3 | 4 | 5;

// from data
export interface SocialHandle {
  platform: string;
  url: string;
}

export interface VideoVariant {
  key?: number; // unique identifier generated on client side just for ant table rendering
  cpuUsageLevel: CpuUsageLevel;
  framerate: number;

  audioPassthrough: boolean;
  audioBitrate: number;
  videoPassthrough: boolean;
  videoBitrate: number;

  scaledWidth: number;
  scaledHeight: number;

  name: string;
}
export interface VideoSettingsFields {
  latencyLevel: number;
  videoQualityVariants: VideoVariant[];
  cpuUsageLevel: CpuUsageLevel;
}

export interface S3Field {
  acl?: string;
  accessKey: string;
  bucket: string;
  enabled: boolean;
  endpoint: string;
  region: string;
  secret: string;
  servingEndpoint?: string;
}

export interface ConfigDetails {
  ffmpegPath: string;
  instanceDetails: ConfigInstanceDetailsFields;
  rtmpServerPort: string;
  s3: S3Field;
  streamKey: string;
  webServerPort: string;
  yp: ConfigDirectoryFields;
  videoSettings: VideoSettingsFields;
}
