interface SteamCmdParametersProps {
  parameters: string[];
}

export class SteamCmdParameters {
  private static readonly STEAM_CREDENTIALS_PLACEHOLDER =
    '<{STEAM_CREDENTIALS_PLACEHOLDER}>';

  parameters: string[];

  constructor(props?: SteamCmdParametersProps) {
    this.parameters = props?.parameters ?? [];
  }

  private add(parameter: string): void {
    this.parameters.push(parameter);
  }

  static Builder = class {
    parameters: SteamCmdParameters;

    constructor() {
      this.parameters = new SteamCmdParameters();
      this.addDefaultParameters();
    }

    addDefaultParameters(): void {
      this.parameters.add('+@NoPromptForPassword 1');
      this.parameters.add('+@ShutdownOnFailedCommand 1');
    }

    withLogin(): this {
      const loginParameter = `+login ${SteamCmdParameters.STEAM_CREDENTIALS_PLACEHOLDER}`;
      this.parameters.add(loginParameter);
      return this;
    }

    withAnonymousLogin(): this {
      this.parameters.add('+login anonymous');
      return this;
    }

    withInstallDir(installDir: string): this {
      this.parameters.add(`+force_install_dir ${installDir}`);
      return this;
    }

    withAppInstall(appId: number, validate: boolean, ...args: string[]): this {
      let installParameter = `+app_update ${appId} ${args
        .filter((arg) => arg != null)
        .join(' ')}`;
      if (validate) {
        installParameter += ' validate';
      }
      this.parameters.add(installParameter);
      return this;
    }

    build(): SteamCmdParameters {
      this.parameters.add('+quit');
      return this.parameters;
    }
  };
}
