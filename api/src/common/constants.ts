export enum ServerType {
  REFORGER,
}

export const GAME_IDS: Record<ServerType, number> = {
  [ServerType.REFORGER]: 1874900,
};

export const SERVER_IDS: Record<ServerType, number> = {
  [ServerType.REFORGER]: 1874900,
};

export const SERVER_EXECUTABLES: Record<ServerType, string> = {
  [ServerType.REFORGER]: 'ArmaReforgerServer',
};

export const SERVER_CONFIG_TEMPLATES: Record<ServerType, string> = {
  [ServerType.REFORGER]: 'serverConfigReforger.ftl',
};

export const STEAM_API_URL =
  'https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/';
