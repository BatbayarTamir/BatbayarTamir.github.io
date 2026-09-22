export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  dedication: string;
  tone: 'dreamy' | 'romantic' | 'nostalgic' | 'warm' | 'acoustic' | 'energetic';
  lyricsSnippet?: string;
  accentColor: string;
  audioUrl?: string;
  fileName?: string;
  fileSize?: number;
  isCustomUpload?: boolean;
}

export interface PolaroidMemory {
  id: string;
  imageUrl: string;
  caption: string;
  date: string;
  location?: string;
  backNote: string;
  rotation: number;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  story: string;
  icon: string;
  tag: string;
}

export interface LoveCoupon {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  redeemed: boolean;
  redeemedAt?: string;
}

export interface GirlfriendSiteConfig {
  herName: string;
  herNickname: string;
  hisName: string;
  anniversaryDate: string; // YYYY-MM-DD
  letterTitle: string;
  letterBody: string;
  letterSignoff: string;
}

export interface GitHubConfig {
  enabled: boolean;
  token: string;
  owner: string;
  repo: string;
  branch: string;
  resourcesPath: string; // e.g. "resources"
}

export interface GitHubUploadResult {
  success: boolean;
  url?: string;
  rawUrl?: string;
  path?: string;
  commitSha?: string;
  error?: string;
}

export interface SanctuaryData {
  config?: Partial<GirlfriendSiteConfig>;
  playlist?: Song[];
  memories?: PolaroidMemory[];
  milestones?: Milestone[];
  reasons?: string[];
  coupons?: LoveCoupon[];
}
