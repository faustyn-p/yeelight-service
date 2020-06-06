/*
Service based on official Yeelight API Specification:
https://www.yeelight.com/download/Yeelight_Inter-Operation_Spec.pdf
*/

import ip = require('ip');
import dgram = require('dgram');
import net = require('net');
import {
	IYeelight,
	IYeelightDevice,
	YeelightDeviceModelEnum,
	YeelightSupportedMethodsEnum,
	YeelightPowerState,
	YeelightSupportedPropertiesEnum,
	YeelightEffect,
} from './yeelight.interface';
import { Socket } from 'dgram';
import { YeelightMethods } from './yeelight.methods';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

export class YeelightService implements IYeelight {
	private readonly socket: Socket = dgram.createSocket('udp4');
	private readonly options: {
		port: number;
		multicastAddr: string;
		discoveryMsg: string;
	} = {
		port: 1982,
		multicastAddr: '239.255.255.250',
		discoveryMsg: 'M-SEARCH * HTTP/1.1\r\nMAN: "ssdp:discover"\r\nST: wifi_bulb\r\n',
	};

	public devices: BehaviorSubject<BehaviorSubject<IYeelightDevice>[]> = new BehaviorSubject<BehaviorSubject<IYeelightDevice>[]>([]);

	constructor(private readonly yeelightMethods: YeelightMethods = new YeelightMethods()) {
		this.listen();

		this.socket.on('message', (message, address) => {
			if (ip.address() === address.address) {
				return;
			}

			this.handleDiscovery(message);
		});
	}

	private listen(): void {
		try {
			this.socket.bind(this.options.port, () => {
				this.socket.setBroadcast(true);
			});

			this.sendMessage(this.options.discoveryMsg, this.options.multicastAddr);
		} catch (ex) {
			throw ex;
		}
	}

	private sendMessage(message: string, address: string): void {
		const buffer = Buffer.from(message);
		this.socket.send(buffer, 0, buffer.length, this.options.port, address, (err) => {
			if (err) {
				throw err;
			}
		});
	}

	private handleDiscovery(message: Buffer): void {
		const headers: string[] = message.toString().split('\r\n');
		const deviceTemp: ITemporaryDeviceObject = {};

		headers.forEach((keyAndValue) => {
			const separatedKayAndValue: string[] = keyAndValue.split(': ');
			if (separatedKayAndValue.length < 2) {
				return;
			}

			const key: string = separatedKayAndValue.shift().toLowerCase();
			let value: any = separatedKayAndValue.join(':');

			switch (key) {
				case 'location':
					const partedLocation: string[] = value.split(':');
					deviceTemp.host = partedLocation[1].replace('//', '');
					deviceTemp.port = Number(partedLocation[2]);
					break;
				case 'support':
					value = value.split(' ');
					break;
				case 'rgb':
					value = `#${value.toString(16)}`;
					break;
				case 'ct':
				case 'hue':
				case 'sat':
				case 'bright':
				case 'color_mode':
					value = Number(value);
					break;
				default:
					break;
			}

			deviceTemp[key] = value;
		});

		const device: IYeelightDevice = {
			connected: new BehaviorSubject<boolean>(true),
			socket: new net.Socket(),
			location: deviceTemp.location,
			host: deviceTemp.host,
			port: deviceTemp.port,
			id: deviceTemp.id,
			model: deviceTemp.model,
			supportedMethods: deviceTemp.support,
			get: {
				name: new BehaviorSubject<string>(deviceTemp.name),
				power: new BehaviorSubject<YeelightPowerState>(deviceTemp.power),
				brightness: new BehaviorSubject<number>(deviceTemp.bright),
				colorTemperature: new BehaviorSubject<number>(deviceTemp.ct),
				rgb: new BehaviorSubject<string>(deviceTemp.rgb),
				hue: new BehaviorSubject<number>(deviceTemp.hue),
				saturation: new BehaviorSubject<number>(deviceTemp.sat),
				colorMode: new BehaviorSubject<number>(deviceTemp.color_mode),
			},
			set: {
				name: undefined,
				asDefault: undefined,
				power: undefined,
				colorTemperature: undefined,
				rgb: undefined,
				hsv: undefined,
				brightness: undefined,
			},
			togglePower: undefined,
			adjust: {
				brightness: undefined,
				temperature: undefined,
				color: undefined,
			},
		};

		device.set = {
			name: (name: string) => this.yeelightMethods.setName(device, name),
			asDefault: () => this.yeelightMethods.setDefault(device),
			power: (powerState: YeelightPowerState, effect: YeelightEffect, duration: number) => this.yeelightMethods.setPower(device, powerState, effect, duration),
			colorTemperature: (colorTemperature: number, effect: YeelightEffect, duration: number) => this.yeelightMethods.setTemperature(device, colorTemperature, effect, duration),
			rgb: (rgb: string | number | number[], effect: YeelightEffect, duration: number) => this.yeelightMethods.setRgb(device, rgb, effect, duration),
			hsv: (hue: number, saturation: number, effect: YeelightEffect, duration: number) => this.yeelightMethods.setHsv(device, hue, saturation, effect, duration),
			brightness: (brightness: number, effect: YeelightEffect, duration: number) => this.yeelightMethods.setBrightness(device, brightness, effect, duration),
		};

		device.togglePower = () => this.yeelightMethods.toggle(device);

		device.adjust = {
			brightness: (difference: number, effect: YeelightEffect, duration: number) => this.yeelightMethods.setBrightness(device, difference, effect, duration),
			temperature: (difference: number, effect: YeelightEffect, duration: number) => this.yeelightMethods.setBrightness(device, difference, effect, duration),
			color: (difference: number, effect: YeelightEffect, duration: number) => this.yeelightMethods.setBrightness(device, difference, effect, duration),
		};

		const deviceIndex: number = this.devices?.value.findIndex((registeredDevice: BehaviorSubject<IYeelightDevice>) => registeredDevice.value.id === device.id,);

		if (deviceIndex >= 0) {
			return;
		}

		device.socket.connect(device.port, device.host, () => {
			device.connected.next(true);
		});

		const deviceBehaviorSubject = new BehaviorSubject<IYeelightDevice>(device);
		this.devices.next([...this.devices.value, deviceBehaviorSubject]);

		device.socket.on('data', (socketMessage: Buffer) => {
			const stringJsons: string[] = socketMessage.toString().split(/\r?\n/).filter(Boolean);

			stringJsons.forEach((stringJson) => {
				try {
					JSON.parse(stringJson);
				} catch (e) {
					return; // not a JSON object, continue
				}

				const data: { method: string; params?: any } = JSON.parse(stringJson);

				if (data.method !== 'props') {
					return;
				}

				for (const param in data.params) {
					if (param) {
						const value: string = data.params[param];

						switch (param) {
							case YeelightSupportedPropertiesEnum.power:
								device.get.power.next(value as YeelightPowerState);
								break;
							case YeelightSupportedPropertiesEnum.brightness:
								device.get.brightness.next(Number(value));
								break;
							case YeelightSupportedPropertiesEnum.colorTemperature:
								device.get.colorTemperature.next(Number(value));
								break;
							case YeelightSupportedPropertiesEnum.rgb:
								device.get.rgb.next(`#${Number(value).toString(16)}`);
								break;
							case YeelightSupportedPropertiesEnum.hue:
								device.get.hue.next(Number(value));
								break;
							case YeelightSupportedPropertiesEnum.saturation:
								device.get.saturation.next(Number(value));
								break;
							case YeelightSupportedPropertiesEnum.colorMode:
								device.get.colorMode.next(Number(value));
								break;
							case YeelightSupportedPropertiesEnum.name:
								device.get.name.next(value);
								break;
							default:
								break;
						}
					}
				}

				deviceBehaviorSubject.next(device);
			});
		});
	}

	public getDeviceByName(name: string): Observable<BehaviorSubject<IYeelightDevice>> {
		return this.devices.pipe(
			map((devices) => devices.find((device) => device.value.get.name.value === name)),
			filter((value) => !!value),
		);
	}

	public getDeviceByModel(model: string): Observable<BehaviorSubject<IYeelightDevice>> {
		return this.devices.pipe(
			map((devices) => devices.find((device) => device.value.model === model)),
			filter((value) => !!value),
		);
	}
}

interface ITemporaryDeviceObject {
	location?: string;
	host?: string;
	port?: number;
	id?: string;
	model?: YeelightDeviceModelEnum;
	support?: YeelightSupportedMethodsEnum[];
	power?: YeelightPowerState;
	bright?: number;
	color_mode?: number;
	ct?: number;
	rgb?: string;
	hue?: number;
	sat?: number;
	name?: string;
}
