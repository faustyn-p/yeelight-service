
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
	* [Subscribing to device property](#subscribing-to-device-property)
	* [Changing property of device](#changing-property-of-device)
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
import { YeelightService } from 'yeelight-service';
const yeelightService = new YeelightService();
```

### Subscribing to devices
This function subscribes to all devices connected to current WiFi. Event will be fired each time, a new device is connected.
```typescript
yeelightService.devices.subscribe((devices) => {
	// do something with devices
});
```

### Get device by name
This function gets device by name. If there are multiple devices with given name, only the first one will be returned.
```typescript
yeelightService.getDeviceByName('deviceName').subscribe((device) => {
	// do something with device
});
```

### Get device by model
This function gets device by model. If there are multiple devices with given model, only the first one will be returned.
```typescript
yeelightService.getDeviceByModel('lamp1').subscribe((device) => {
	// do something with device
});
```

### Subscribing to device property
You can subscribe to device property (e.g. subscribe to power state)
```typescript
yeelightService.getDeviceByModel('lamp1').subscribe((device) => {
	device.power.subscribe((powerState) => {
		// this code will be executed each time power state of the device changes
	});
});
```
Or you can get power state just once
```typescript
yeelightService.getDeviceByModel('lamp1').subscribe((device) => {
	const power = device.power.value;
});
```
If you want to observe more than one property, do it in rxjs-way.

### Changing property of device
Every function changing any device property returns promise object with operation status. 

```typescript
yeelightService.getDeviceByModel('lamp1').subscribe((device) => {
	device.setPower('on').then((result) => {
		// do something with result
	});
});
```

## Contributing

All contributions are appreciated. To make contribution:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/featureName`)
3. Commit your Changes (`git commit -m 'Short description'`)
4. Push to the Branch (`git push origin feature/featureName`)
5. Open a Pull Request


## License

This package is distributed under the MIT License.

