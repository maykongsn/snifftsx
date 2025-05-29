export const MIGRATE_KEY = 'migrated';
export enum UpgradeStatus {
  START = 'START',
  UPGRADING = 'UPGRADING',
  UPGRADED = 'UPGRADED',
  UPGRADE_FAILED = 'UPGRADE_FAILED',
}

export const V1DB_NAME = 'LobeHub';
export const V1DB_TABLE_NAME = 'LOBE_CHAT';

export interface MigrationError {
  message: string;
  stack: string;
}