export interface ArmaReforgerServerConfig {
  dedicatedServerId: string;
  region: string;
  gameHostBindAddress: string;
  gameHostBindPort: number;
  gameHostRegisterBindAddress: string;
  gameHostRegisterPort: number;
  adminPassword: string;
  game: {
    name: string;
    password: string;
    scenarioId: string;
    playerCountLimit: number;
    autoJoinable: boolean;
    visible: boolean;
    supportedGameClientTypes: string[];
    gameProperties: {
      serverMaxViewDistance: number;
      serverMinGrassDistance: number;
      networkViewDistance: number;
      disableThirdPerson: boolean;
      fastValidation: boolean;
      battlEye: boolean;
      VONDisableUI: boolean;
      VONDisableDirectSpeechUI: boolean;
      missionHeader: {
        m_iPlayerCount: number;
        m_eEditableGameFlags: number;
        m_eDefaultGameFlags: number;
        other: string;
      };
    };
    mods: Array<{
      modID: string;
      name: string;
    }>;
  };
  a2sQueryEnabled: boolean;
  steamQueryPort: number;
}

function toJson(serverConfig: ArmaReforgerServerConfig): string {
  return JSON.stringify(serverConfig, null, 2);
}

const defaultReforgerServerConfig: ArmaReforgerServerConfig = {
  dedicatedServerId: '',
  region: 'EU',
  gameHostBindAddress: '',
  gameHostBindPort: 0,
  gameHostRegisterBindAddress: '',
  gameHostRegisterPort: 0,
  adminPassword: '',
  game: {
    name: '',
    password: '',
    scenarioId: '',
    playerCountLimit: 0,
    autoJoinable: false,
    visible: true,
    supportedGameClientTypes: ['PLATFORM_PC'],
    gameProperties: {
      serverMaxViewDistance: 2500,
      serverMinGrassDistance: 50,
      networkViewDistance: 1000,
      disableThirdPerson: true,
      fastValidation: true,
      battlEye: false,
      VONDisableUI: true,
      VONDisableDirectSpeechUI: true,
      missionHeader: {
        m_iPlayerCount: 40,
        m_eEditableGameFlags: 6,
        m_eDefaultGameFlags: 6,
        other: 'values',
      },
    },
    mods: [],
  },
  a2sQueryEnabled: true,
  steamQueryPort: 0,
};

export const ArmaReforgerServerConfig = {
  toJson,
  defaultReforgerServerConfig,
};
