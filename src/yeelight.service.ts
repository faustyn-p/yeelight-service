/*
Service based on official Yeelight API Specification:
https://www.yeelight.com/download/Yeelight_Inter-Operation_Spec.pdf
*/

import ip = require('ip');
import dgram = require('dgram');
import {
	IYeelight,
	IYeelightDevice,
	YeelightDeviceModelEnum,
	YeelightSupportedMethodsEnum,
	YeelightPowerState,
	YeelightColorModeEnum,
} from './yeelight.interface';
import { Socket } from 'dgram';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { YeelightDevice } from './device.class';

export class YeelightService implements IYeelight {
	private readonly socket: Socket = dgram.createSocket('udp4');
	private readonly options: { port: number; multicastAddr: string; discoveryMsg: string; } = { port: 1982, multicastAddr: '239.255.255.250', discoveryMsg: 'M-SEARCH * HTTP/1.1\r\nMAN: "ssdp:discover"\r\nST: wifi_bulb\r\n' };
	public devices: BehaviorSubject<IYeelightDevice[]> = new BehaviorSubject<IYeelightDevice[]>([]);

	constructor() {
		this.listen();

		this.socket.on('message', (message: Buffer, address: dgram.RemoteInfo) => {
			if (ip.address() === address.address) {
				return;
			}

			this.handleDiscovery(message);
		});
	}

	public getDeviceByName(name: string): Observable<IYeelightDevice> {
		return this.devices.pipe(
			map((devices: IYeelightDevice[]) => devices.find((device: IYeelightDevice) => device.name.value === name)),
			filter((value: IYeelightDevice) => !!value),
		);
	}

	public getDeviceByModel(model: string): Observable<IYeelightDevice> {
		return this.devices.pipe(
			map((devices: IYeelightDevice[]) => devices.find((device: IYeelightDevice) => device.model === model)),
			filter((value: IYeelightDevice) => !!value),
		);
	}

	public destroy(): void {
		this.devices.value.forEach((device: IYeelightDevice) => {
			device.destroy();
		});
		this.socket.close();
	}

	private listen(): void {
		try {
			this.socket.bind(this.options.port, () => {
				this.socket.setBroadcast(true);
			});

			const buffer: Buffer = Buffer.from(this.options.discoveryMsg);
			this.socket.send(buffer, 0, buffer.length, this.options.port, this.options.multicastAddr);
		} catch (ex) {
			return;
		}
	}

	private handleDiscovery(message: Buffer): void {
		try {
			message.toString().split('\r\n');
		} catch(e) {
			return; // not a valid discovery message
		}

		const headers: string[] = message.toString().split('\r\n');

		const host: string = this.getHostFromHeaders(headers);
		const port: number = this.getPortFromHeaders(headers);
		if (!host || !port) {
			return;
		}

		const device: IYeelightDevice = new YeelightDevice(host, port);
		device.id = this.getIdFromHeaders(headers);
		device.supportedMethods = this.getSupportedMethodsFromHeaders(headers);
		device.model = this.getModelFromHeaders(headers);
		device.brightness.next(this.getBrightnessFromHeaders(headers));
		device.colorMode.next(this.getColorModeFromHeaders(headers));
		device.colorTemperature.next(this.getColorTemperatureFromHeaders(headers));
		device.hue.next(this.getHueFromHeaders(headers));
		device.rgb.next(this.getRgbFromHeaders(headers));
		device.saturation.next(this.getSaturationFromHeaders(headers));
		device.name.next(this.getNameFromHeaders(headers));
		device.power.next(this.getPowerFromHeaders(headers));

		const deviceIndex: number = this.devices?.value.findIndex((registeredDevice: IYeelightDevice) => registeredDevice.id === device.id,);

		if (deviceIndex >= 0) {
			this.devices.value[deviceIndex] = device;
			return;
		}

		device.connected.next(true);
		this.devices.next([...this.devices.value, device]);
	}

	private splitHeader(header: string): { key: string; value: string } {
		const separatedKayAndValue: string[] = header.split(': ');
		if (separatedKayAndValue.length < 2) {
			return;
		}
		const key: string = separatedKayAndValue.shift().toLowerCase();
		const value: any = separatedKayAndValue.join(':');

		return { key, value };
	}

	private getFromHeaders(parameter: string, headers: string[]): { key: string; value: string } {
		const header: string = headers.find((singleHeader: string) => singleHeader.indexOf(`${ parameter }:`) >= 0);
		const keyAndValue: { key: string; value: string } = this.splitHeader(header);
		return keyAndValue;
	}

	private getHostFromHeaders(headers: string[]): string {
		const location: { key: string; value: string } = this.getFromHeaders('Location', headers);
		if (!location?.value) {
			return;
		}

		const partedLocation: string[] = location.value.split(':');
		if (partedLocation.length < 2) {
			return;
		}
		return partedLocation[1].replace('//', '');
	}

	private getPortFromHeaders(headers: string[]): number {
		const location: { key: string; value: string } = this.getFromHeaders('Location', headers);
		if (!location?.value) {
			return;
		}

		const partedLocation: string[] = location.value.split(':');
		if (partedLocation.length < 3) {
			return;
		}
		return Number(partedLocation[2]);
	}

	private getIdFromHeaders(headers: string[]): string {
		const id: { key: string; value: string } = this.getFromHeaders('id', headers);
		if (!id?.value) {
			return;
		}

		return id.value;
	}

	private getModelFromHeaders(headers: string[]): YeelightDeviceModelEnum {
		const model: { key: string; value: string } = this.getFromHeaders('model', headers);
		if (!model?.value) {
			return;
		}

		return model.value as YeelightDeviceModelEnum;
	}

	private getNameFromHeaders(headers: string[]): string {
		const name: { key: string; value: string } = this.getFromHeaders('name', headers);
		if (!name?.value) {
			return;
		}

		return name.value;
	}

	private getPowerFromHeaders(headers: string[]): YeelightPowerState {
		const power: { key: string; value: string } = this.getFromHeaders('power', headers);
		if (!power?.value || (power.value !== 'on' && power.value !== 'off')) {
			return;
		}

		return power.value;
	}

	private getSupportedMethodsFromHeaders(headers: string[]): YeelightSupportedMethodsEnum[] {
		const support: { key: string; value: string } = this.getFromHeaders('support', headers);
		if (!support?.value) {
			return;
		}
		const supportedMethods: YeelightSupportedMethodsEnum[] = support.value.split(' ') as YeelightSupportedMethodsEnum[];
		return supportedMethods;
	}

	private getBrightnessFromHeaders(headers: string[]): number {
		const brightness: { key: string; value: string } = this.getFromHeaders('bright', headers);
		if (!brightness?.value) {
			return;
		}

		return Number(brightness.value);
	}

	private getColorModeFromHeaders(headers: string[]): YeelightColorModeEnum {
		const colorMode: { key: string; value: string } = this.getFromHeaders('color_mode', headers);
		if (!colorMode?.value || !Object.values(YeelightColorModeEnum).includes(colorMode.value)) {
			return;
		}

		return Number(colorMode.value);
	}

	private getColorTemperatureFromHeaders(headers: string[]): number {
		const colorTemperature: { key: string; value: string } = this.getFromHeaders('ct', headers);
		if (!colorTemperature?.value) {
			return;
		}

		return Number(colorTemperature.value);
	}

	private getHueFromHeaders(headers: string[]): number {
		const hue: { key: string; value: string } = this.getFromHeaders('hue', headers);
		if (!hue?.value) {
			return;
		}

		return Number(hue.value);
	}

	private getRgbFromHeaders(headers: string[]): string {
		const rgb: { key: string; value: string } = this.getFromHeaders('rgb', headers);
		if (!rgb?.value) {
			return;
		}

		return `#${ Number(rgb.value).toString(16) }`;
	}

	private getSaturationFromHeaders(headers: string[]): number {
		const saturation: { key: string; value: string } = this.getFromHeaders('sat', headers);
		if (!saturation?.value) {
			return;
		}

		return Number(saturation.value);
	}
}
