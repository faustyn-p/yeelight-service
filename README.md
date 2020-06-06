
<p align="center">
  <a href="https://github.com/faustyn-p/yeelight-service">
    <img src="assets/logo.jpg" alt="Logo">
  </a>

  <h3 align="center">Yeelight Service</h3>

  <p align="center">Simple service for managing Yeelight devices</p>
  <p align="center">
    <a href="https://github.com/faustyn-p/yeelight-service/issues">Report Bug</a>
    ·
    <a href="https://github.com/faustyn-p/yeelight-service/issues">Request Feature</a>
  </p>
</p>

## Table of Contents

* [Getting Started](#getting-started)
* [Usage and examples](#usage)
    * [Import YeelightService](#import-yeelightservice)
    * [Subscribing to devices](#subscribing-to-devices)
    * [Get device by name](#get-device-by-name)
    * [Get device by model](#get-device-by-model)
    * [Subscribing to device](#subscribing-to-device)
    * [Subscribing to device property](#subscribing-to-device-property)
    * [Changing property of device](#changing-property-of-device)
* [Yeelight Device Object](#yeelight-device-object)
    * [Structure](#structure)
    * [Basic properties](#basic-properties)
	* [More information](#more-information)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

## Getting Started

Install package
```sh
npm install yeelight-service
```
or

Install and save in package.json
```sh
npm install yeelight-service --save
```

## Usage and examples

### Import YeelightService
```typescript
import { YeelightService } from 'yeelight-service/yeelight.service';
const yeelightService = new YeelightService();
```

### Subscribing to devices
This function subscribes to all devices connected to current WiFi. Event will be fired each time, a new device is connected.
```typescript
yeelightService.devices.subscribe((deviceSubject) => {
    // do something with devices
});
```

### Get device by name
This function gets device by name. If there are multiple devices with given name, only the first one will be returned.
```typescript
yeelightService.getDeviceByName('deviceName').subscribe((deviceSubject) => {
    // do something with device
});
```

### Get device by model
This function gets device by model. If there are multiple devices with given model, only the first one will be returned.
```typescript
yeelightService.getDeviceByModel('lamp1').subscribe((deviceSubject) => {
    // do something with device
});
```

### Subscribing to device
You can subscribe to device
```typescript
yeelightService.getDeviceByModel('lamp1').subscribe((deviceSubject) => {
    deviceSubject.subscribe((device) => {
        // this code will be executed each time property of the device change
	});
});
```
or
```typescript
yeelightService.getDeviceByModel('lamp1').subscribe((deviceSubject) => {
    const device = deviceSubject.value; // device signed once, usefull if you don't want to be notifieed each time property of the device change
});
```

### Subscribing to device property
You can subscribe to device property (e.g. subscribe to power state)
```typescript
yeelightService.getDeviceByModel('lamp1').subscribe((deviceSubject) => {
	const device = deviceSubject.value;
	device.get.power.subscribe((powerState) => {
        // this code will be executed each time power state of the device changes
	});
});
```
Or you can get power state just once
```typescript
yeelightService.getDeviceByModel('lamp1').subscribe((deviceSubject) => {
	const device = deviceSubject.value;
	const power = device.get.power.value;
});
```

### Changing property of device
```typescript
yeelightService.getDeviceByModel('lamp1').subscribe((deviceSubject) => {
	const device = deviceSubject.value;
    device.set.power('on').then((result) => {
        // do something with result
	});
});
```

## Yeelight Device Object

### Structure
Structure of device object is shown below
``` typescript
Device {
	connected: BehaviorSubject<boolean>;
	socket: Socket;
	location: string;
	host: string;
	port: number;
	id: string;
	model: YeelightDeviceModelEnum;
	supportedMethods: YeelightSupportedMethodsEnum[];
	get: {
		name: BehaviorSubject<string>;
		power: BehaviorSubject<YeelightPowerState>;
		brightness?: BehaviorSubject<number>;
		colorTemperature?: BehaviorSubject<number>;
		rgb?: BehaviorSubject<string>;
		hue?: BehaviorSubject<number>;
		saturation?: BehaviorSubject<number>;
		colorMode?: BehaviorSubject<number>;
	};
	set: {
		name: (name: string) => Promise<IYeelightMethodResponse>;
		power: (power: YeelightPowerState, effect?: YeelightEffect, duration?: number) => Promise<IYeelightMethodResponse>;
		colorTemperature: (colorTemperature: number, effect?: YeelightEffect, duration?: number) => Promise<IYeelightMethodResponse>;
		rgb: (rgb: string | number | number[], effect?: YeelightEffect, duration?: number) => Promise<IYeelightMethodResponse>;
		hsv: (hue: number, saturation: number, effect?: YeelightEffect, duration?: number) => Promise<IYeelightMethodResponse>;
		brightness: (brightness: number, effect?: YeelightEffect, duration?: number) => Promise<IYeelightMethodResponse>;
		asDefault: () => Promise<IYeelightMethodResponse>;
	};
	togglePower: () => Promise<IYeelightMethodResponse>;
	adjust: {
		brightness: (difference: number, effect?: YeelightEffect, duration?: number) => Promise<IYeelightMethodResponse>;
		temperature: (difference: number, effect?: YeelightEffect, duration?: number) => Promise<IYeelightMethodResponse>;
		color: (difference: number, effect?: YeelightEffect, duration?: number) => Promise<IYeelightMethodResponse>;
	};
}
```

### Basic properties

#### Connected
Status of Yeelight Device connection. You can subscribe to this value.
```typescript
connected: BehaviorSubject<boolean>;
```

### Id, model, supportedMethods
These values shouldn't change. Id is device unique value, you can distinguish devices by that value.
Model is one of: `mono`, `color`, `stripe`, `ceiling`, `bslamp` or `lamp1`.
SupportedMethods is list of methods, that are allowed by the device.
```typescript
id: string;
model: YeelightDeviceModelEnum;
supportedMethods: YeelightSupportedMethodsEnum[];
```

### More information
For more information check out [`yeelight.interface.ts`](https://github.com/faustyn-p/yeelight-service/blob/master/src/yeelight.interface.ts) file.

## Contributing

All contributions are appreciated. To make contribution:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/featureName`)
3. Commit your Changes (`git commit -m 'Short description'`)
4. Push to the Branch (`git push origin feature/featureName`)
5. Open a Pull Request


## License

This package is distributed under the MIT License.

