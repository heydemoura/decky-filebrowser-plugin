import { ServerAPI } from 'decky-frontend-lib';
export default class FileBrowserManager {
  private port: Number;
  private pid: Number;
  private ipv4_address: string;
  private serverAPI: ServerAPI;

  // @ts-ignore
  private setServer(serv: ServerAPI): void {
    this.serverAPI = serv;
  }

  constructor(serverAPI: ServerAPI) {
    this.serverAPI = serverAPI;
    this.port = 8088;
  }

  getServer(): ServerAPI {
    return this.serverAPI;
  }

  async getUserSettings() {
    const result = await this.serverAPI.callPluginMethod("get_user_settings", {});

    if ( result.success ) {
      return result.result;
    } else {
      return new Error(result.result);
    }
  }

  getPort() {
    return +this.port;
  }

  async getPortFromSettings() {
    const result = await this.serverAPI.callPluginMethod("get_setting", { key: "port" });

    if ( result.success ) {
      this.port = result.result as Number;
      return;
    } else {
      return new Error( result.result as string );
    }
  }

  async setPort(port: Number) {
    const result = await this.serverAPI.callPluginMethod("save_user_settings", { key: "port", value: port });

    if ( result.success ) {
      this.port = result.result as Number;
      return;
    } else {
      return new Error( result.result as string );
    }
  }

  async getFileBrowserStatus() {
    const result = await this.serverAPI.callPluginMethod("getFileBrowserStatus", {});

    if ( result.success ) {
      this.port = result.result?.port as Number;
      this.ipv4_address = result.result?.ipv4_address as string;
      this.pid = result.result?.pid as Number;

      return result.result;
    } else {
      return new Error( result.result );
    }
  }

  getIPV4Address() {
    return this.ipv4_address;
  }

  getPID() {
    return this.pid;
  }
}
