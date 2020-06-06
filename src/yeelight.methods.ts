/*
Service based on official Yeelight API Specification:
https://www.yeelight.com/download/Yeelight_Inter-Operation_Spec.pdf
*/

import {
  IYeelightDevice,
  YeelightSupportedMethodsEnum,
  IYeelightMethodResponse,
  YeelightMethodStatusEnum,
  YeelightEffect,
  YeelightPowerState,
  TYeelightParams,
  IYeelight,
  IYeelightMethods,
} from './yeelight.interface';

export class YeelightMethods implements IYeelightMethods {
  private readonly defaults: {
    effect: YeelightEffect;
    duration: number;
  } = {
    effect: 'smooth',
    duration: 1000,
  };

  /* Responses */
  private setResponse(code: YeelightMethodStatusEnum): IYeelightMethodResponse {
    return {
      status: code,
    };
  }

  private throwError(code: YeelightMethodStatusEnum, message: string): IYeelightMethodResponse {
    return {
      status: code,
      errorMessage: message,
    };
  }

  /* Yeelight Device Methods */
  public async setPower(
    device: IYeelightDevice,
    power: YeelightPowerState,
    effect: YeelightEffect = this.defaults.effect,
    duration: number = this.defaults.duration,
  ): Promise<IYeelightMethodResponse> {
    const method = YeelightSupportedMethodsEnum.setPower;

    if (power !== 'on' && power !== 'off') {
      return this.throwError(YeelightMethodStatusEnum.BAD_REQUEST, `Power parameter should be "on" or "off".`);
    }

    const params: TYeelightParams = [power, effect, duration];

    return this.castMethod(device, method, params);
  }

  public async setTemperature(
    device: IYeelightDevice,
    colorTemperature: number,
    effect: YeelightEffect = this.defaults.effect,
    duration: number = this.defaults.duration,
  ): Promise<IYeelightMethodResponse> {
    const method = YeelightSupportedMethodsEnum.setTemperature;
    if (!colorTemperature || colorTemperature < 2700 || colorTemperature > 6500) {
      return this.throwError(
        YeelightMethodStatusEnum.BAD_REQUEST,
        `Color temperature is not a number in the range of 2700 ~ 6500.`,
      );
    }

    const params: TYeelightParams = [colorTemperature, effect, duration];

    return this.castMethod(device, method, params);
  }

  public async setRgb(
    device: IYeelightDevice,
    rgb: string | number | number[],
    effect: YeelightEffect = this.defaults.effect,
    duration: number = this.defaults.duration,
  ): Promise<IYeelightMethodResponse> {
    const method = YeelightSupportedMethodsEnum.setRgb;

    if (typeof rgb === 'string' && rgb.match(/^(#)((?:[A-Fa-f0-9]{3}){1,2})$/)) {
      rgb = parseInt(rgb.substring(1), 16);
    }

    if (typeof rgb === 'object') {
      // tslint:disable-next-line: no-bitwise
      rgb = (rgb[0] << (16 + rgb[1])) << (16 + rgb[2]);
    }

    rgb = Number(rgb);

    if (rgb < 0 || rgb > 16777215) {
      return this.throwError(
        YeelightMethodStatusEnum.BAD_REQUEST,
        `RGB color is missing or it's not valid HEX RGB Color.`,
      );
    }

    const params: TYeelightParams = [rgb, effect, duration];

    return this.castMethod(device, method, params);
  }

  public async setHsv(
    device: IYeelightDevice,
    hue: number,
    saturation: number,
    effect: YeelightEffect = this.defaults.effect,
    duration: number = this.defaults.duration,
  ): Promise<IYeelightMethodResponse> {
    const method = YeelightSupportedMethodsEnum.setHsv;

    if (hue < 0 || hue > 359) {
      return this.throwError(
        YeelightMethodStatusEnum.BAD_REQUEST,
        `Hue is missing or it's not valid hue value (range from 0 to 359).`,
      );
    }

    if (saturation < 0 || saturation > 100) {
      return this.throwError(
        YeelightMethodStatusEnum.BAD_REQUEST,
        `Saturation is missing or it's not valid saturation value (range from 0 to 100).`,
      );
    }

    const params: TYeelightParams = [hue, saturation, effect, duration];

    return this.castMethod(device, method, params);
  }

  public async setBrightness(
    device: IYeelightDevice,
    brightness: number,
    effect: YeelightEffect = this.defaults.effect,
    duration: number = this.defaults.duration,
  ): Promise<IYeelightMethodResponse> {
    const method = YeelightSupportedMethodsEnum.setBrightness;

    if (brightness < 0 || brightness > 100) {
      return this.throwError(
        YeelightMethodStatusEnum.BAD_REQUEST,
        `Brigtness should be number in range from 0 to 100 (percent).`,
      );
    }

    const params: TYeelightParams = [brightness, effect, duration];

    return this.castMethod(device, method, params);
  }

  public async setDefault(device: IYeelightDevice): Promise<IYeelightMethodResponse> {
    const method = YeelightSupportedMethodsEnum.setDefault;

    return this.castMethod(device, method);
  }

  public async setName(device: IYeelightDevice, name: string): Promise<IYeelightMethodResponse> {
    const method = YeelightSupportedMethodsEnum.setName;
    const params: TYeelightParams = [name];

    return this.castMethod(device, method, params);
  }

  public async toggle(device: IYeelightDevice): Promise<IYeelightMethodResponse> {
    const method = YeelightSupportedMethodsEnum.toggle;
    return this.castMethod(device, method);
  }

  public async adjustBrightness(
    device: IYeelightDevice,
    difference: number,
    effect: YeelightEffect = this.defaults.effect,
    duration: number = this.defaults.duration,
  ): Promise<IYeelightMethodResponse> {
    const method = YeelightSupportedMethodsEnum.adjustBrightness;

    if (difference < -100 || difference > 100) {
      return this.throwError(
        YeelightMethodStatusEnum.BAD_REQUEST,
        `Brigtness adjustment should be number in range from -100 to 100 (percent).`,
      );
    }

    const params: TYeelightParams = [difference, effect, duration];
    return this.castMethod(device, method, params);
  }

  public async adjustTemperature(
    device: IYeelightDevice,
    difference: number,
    effect: YeelightEffect = this.defaults.effect,
    duration: number = this.defaults.duration,
  ): Promise<IYeelightMethodResponse> {
    const method = YeelightSupportedMethodsEnum.adjustTemperature;

    if (difference < -100 || difference > 100) {
      return this.throwError(
        YeelightMethodStatusEnum.BAD_REQUEST,
        `Temperature adjustment should be number in range from -100 to 100 (percent).`,
      );
    }

    const params: TYeelightParams = [difference, effect, duration];
    return this.castMethod(device, method, params);
  }

  public async adjustColor(
    device: IYeelightDevice,
    difference: number,
    effect: YeelightEffect = this.defaults.effect,
    duration: number = this.defaults.duration,
  ): Promise<IYeelightMethodResponse> {
    const method = YeelightSupportedMethodsEnum.adjustColor;

    if (difference < -100 || difference > 100) {
      return this.throwError(
        YeelightMethodStatusEnum.BAD_REQUEST,
        `Color adjustment should be number in range from -100 to 100 (percent).`,
      );
    }

    const params: TYeelightParams = [difference, effect, duration];
    return this.castMethod(device, method, params);
  }

  /* Casting method */
  private async castMethod(
    device: IYeelightDevice,
    method: YeelightSupportedMethodsEnum,
    params: TYeelightParams = [],
  ): Promise<IYeelightMethodResponse> {
    const id = 1;

    if (device.connected.value === false || device.socket === null) {
      return this.throwError(YeelightMethodStatusEnum.DEVICE_DISCONNECTED, `Device is disconnected.`);
    }

    if (!device.supportedMethods.includes(method)) {
      return this.throwError(
        YeelightMethodStatusEnum.METHOD_NOT_SUPPORTED,
        `Method ${method} is not allowed for device ${device.get.name.value ?? device.model}.`,
      );
    }

    return new Promise((resolve) => {
      this.sendCommand(device, { id, method, params }, (result: IYeelightMethodResponse) => {
        setTimeout(() => resolve(result), this.defaults.duration);
      });
    });
  }

  public sendCommand(
    device: IYeelightDevice,
    command: { id: number; method: string; params: TYeelightParams },
    callback: (response: IYeelightMethodResponse) => void,
  ): void {
    const message = JSON.stringify(command);

    device.socket.write(message + '\r\n', 'utf-8', () => {
      device.socket.on('data', (socketMessage) => {
        const stringJsons: string[] = socketMessage.toString().split(/\r?\n/).filter(Boolean);
        for (const stringJson of stringJsons) {
          if (stringJson.length > 1) {
            try {
              JSON.parse(stringJson);
            } catch (e) {
              return; // not a JSON object, continue
            }

            const data: { id: number; error?: { code: number; message: string }; result?: string[] } = JSON.parse(
              stringJson,
            );

            if (!data.id || data.id !== 1) {
              return;
            }

            if (data.error) {
              callback(this.throwError(YeelightMethodStatusEnum.YEELIGHT_DEVICE_ERROR, data.error.message));
              return;
            }

            callback(this.setResponse(YeelightMethodStatusEnum.OK));
          }
        }
      });
    });
  }
}
