
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
    .
    <a href="https://github.com/faustyn-p/yeelight-service/wiki">Wiki</a>
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
* [Types](#types)
* [Performance](#performance)
* [Methods](#methods)
    * [setName](#setname)
    * [setPower](#setpower)
    * [setColorTemperature](#setcolortemperature)
    * [setRgb](#setrgb)
    * [setHsv](#sethsv)
    * [setBrightness](#setbrightness)
    * [setAsDefault](#setasdefault)
    * [togglePower](#togglepower)
    * [adjustBrightness](#adjustbrightness)
    * [adjustTemperature](#adjusttemperature)
    * [adjustColor](#adjustcolor)
    * [sendCommand](#sendcommand)
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
This function subscribes to all devices connected to current WiFi. Event will be executed each time, a new device is connected.
```typescript
yeelightService.devices.subscribe((devices) => {
    // executed each time device is connected
    // do something with devices
});
```

### Get device by name
This function gets device by name. If there are multiple devices with given name, only the first one will be returned.
```typescript
yeelightService.getDeviceByName('deviceName').subscribe((device) => {
    // executed when device will be found
    // do something with device
});
```

### Get device by model
This function gets device by model. If there are multiple devices with given model, only the first one will be returned.
```typescript
yeelightService.getDeviceByModel('lamp1').subscribe((device) => {
    // executed when device will be found
    // do something with device
});
```

### Subscribing to device property
You can subscribe to device property (e.g. subscribe to power state)
```typescript
yeelightService.getDeviceByModel('lamp1').subscribe((device) => {
    device.power.subscribe((powerState) => {
        // executed each time power state change
        // do something with power state
    });
});
```
Or you can get power state just once
```typescript
yeelightService.getDeviceByModel('lamp1').subscribe((device) => {
    const power = device.power.value;
    // do something with power state
});
```
If you want to observe more than one property, do it in RXJS-way. For example, if you want to be notified each time when `connection status`, `power state` OR `brightness` change, you can use RXJS `combineLatest`.

```typescript
yeelightService.getDeviceByModel('lamp1').subscribe((device) => {
    combineLatest(
        device.connected,
        device.power,
        device.brightness
    ).pipe(
        map(([connected, power, brightness]) => {
            return { connected, power, brightness };
        })
    ).subscribe((data) => {
        // executed each time `connected`, `power` or `brightness` change
        // do something with data
    });
});
``` 

### Changing property of device
Every function changing any device property returns promise object with operation status. 

```typescript
yeelightService.getDeviceByModel('lamp1').subscribe((device) => {
    device.setPower('on').then((result) => {
        // do something with result
    });
});
```

## Types
Interface file: `'yeelight-service/lib/yeelight.interface'`

Example (log to console after changing power state failed):
```typescript
import { YeelightService } from 'yeelight-service';
import {
    IYeelight,
    IYeelightDevice,
    IYeelightMethodResponse,
    YeelightMethodStatusEnum
} from 'yeelight-service/lib/yeelight.interface';

const yeelightService: IYeelight = new YeelightService();
yeelightService.getDeviceByModel('lamp1').subscribe((device: IYeelightDevice) => {
    device.setPower('on').then((result: IYeelightMethodResponse) => {
        if (result.status === YeelightMethodStatusEnum.OK) {
            return;
        }

        if (result.errorMessage) {
            console.log(result.errorMessage);
            return;
        }

        console.log(`Unexpected error occured. Error code: ${ result.status }`);
    });
});
```

## Performance
If you want to terminate the service, please use `destroy` function. It will close all devices sockets, as well as main service socket itself.
```typescript
yeelightService.destroy();
```

You can close connection of single device, by using `destroy` function on device. Example:
```typescript
yeelightService.devices.subscribe((devices) => {
    devices.forEach(() => {
        const deviceName = device.name.value;
        const deviceConnected = device.connected.value;

        if (!deviceConnected) {
            return;
        }

        if (deviceName !== 'myDevice') {
            device.destroy();
        }

        // do something with device `myDevice` knowing, that every other device is disconnected from socket
    });
});
```

## Methods
Not all of methods from official Yeelight API are supported. If you need method that is not on the list to be part of the package, please create [github issue](https://github.com/faustyn-p/yeelight-service/issues), or you can use `sendCommand` method described below.

### setName
Set name of the device. Only parameter is new name of the device. Method returns Promise with status code and error (if occured).

```typescript
@param {string} name
@returns {Promise<IYeelightMethodResponse>}
device.setName(name);
```

### setPower
Turn on or off the device. Only required parameter is new state of the device. Method returns Promise with status code and error (if occured). See also [togglePower](#togglePower).
Effect and duration are optional properties. By default duration is set to `1000`ms and effect is set to `smooth`.

```typescript
@param {YeelightPowerState} power
@param {YeelightEffect} effect
@param {number} duration
@returns {Promise<IYeelightMethodResponse>}
device.setPower(power, effect, duration);
```

### setColorTemperature
Set color temperature of the device. Only required parameter is new color temperature - defined in Kelvin degrees in the range from 2700 to 6500. Method returns Promise with status code and error (if occured).
Effect and duration are optional properties. By default duration is set to `1000`ms and effect is set to `smooth`.

```typescript
@param {number} colorTemperature
@param {YeelightEffect} effect
@param {number} duration
@returns {Promise<IYeelightMethodResponse>}

device.setColorTemperature(colorTemperature, effect, duration);
```


### setRgb
Set RGB color of the device. Only required parameter is new RGB color. It can be hex value (like "#FFFFFF"), number (16777215) or array of numbers ([255, 255, 255]). Method returns Promise with status code and error (if occured).
Effect and duration are optional properties. By default duration is set to `1000`ms and effect is set to `smooth`.

```typescript
@param {string | number | number[]} rgb
@param {YeelightEffect} effect
@param {number} duration
@returns {Promise<IYeelightMethodResponse>}

device.setRgb(rgb, effect, duration);
```


### setHsv
Set hue and saturation of the device. Required parameters are hue (in range from 0 to 359 degree) and saturation (in percent in range from 0 to 100). Method returns Promise with status code and error (if occured).
Effect and duration are optional properties. By default duration is set to `1000`ms and effect is set to `smooth`.

```typescript
@param {number} hue
@param {number} saturation
@param {YeelightEffect} effect
@param {number} duration
@returns {Promise<IYeelightMethodResponse>}

device.setHsv(hue, saturation, effect, duration);
```


### setBrightness
Set brightness of the device. Only required parameter is brightness (in percent in range from 0 to 100). Method returns Promise with status code and error (if occured).
Effect and duration are optional properties. By default duration is set to `1000`ms and effect is set to `smooth`.

```typescript
@param {number} brightness
@param {YeelightEffect} effect
@param {number} duration
@returns {Promise<IYeelightMethodResponse>}

device.setBrightness(brightness, effect, duration);
```


### setAsDefault
Set current device state as default state. Method returns Promise with status code and error (if occured).
>This method is used to save current state of smart LED in persistent memory. So if user powers off and then powers on the smart LED again (hard power reset), the smart LED will show last saved state.

```typescript
@returns {Promise<IYeelightMethodResponse>}

device.setAsDefault();
```


### togglePower
Toggle current device power state. Method returns Promise with status code and error (if occured). See also [setPower](#setPower).

```typescript
@returns {Promise<IYeelightMethodResponse>}

device.togglePower();
```


### adjustBrightness
Adjust brightness of the device. Only required parameter is difference between current state and new state (in percent in range from -100 to 100). Method returns Promise with status code and error (if occured).
Effect and duration are optional properties. By default duration is set to `1000`ms and effect is set to `smooth`.

```typescript
@param {number} difference
@param {YeelightEffect} effect
@param {number} duration
@returns {Promise<IYeelightMethodResponse>}

device.adjustBrightness(difference, effect, duration);
```


### adjustTemperature
Adjust color temperature of the device. Only required parameter is difference between current state and new state (in percent in range from -100 to 100). Method returns Promise with status code and error (if occured).
Effect and duration are optional properties. By default duration is set to `1000`ms and effect is set to `smooth`.

```typescript
@param {number} difference
@param {YeelightEffect} effect
@param {number} duration
@returns {Promise<IYeelightMethodResponse>}

device.adjustTemperature(difference, effect, duration);
```


### adjustColor
Adjust color of the device. Only required parameter is difference between current state and new state (in percent in range from -100 to 100). Method returns Promise with status code and error (if occured).
Effect and duration are optional properties. By default duration is set to `1000`ms and effect is set to `smooth`.

```typescript
@param {number} difference
@param {YeelightEffect} effect
@param {number} duration
@returns {Promise<IYeelightMethodResponse>}

device.adjustColor(difference, effect, duration);
```


### sendCommand
If you need to use method from Yeelight API, that is not included in the package, you can use `sendCommand` method. Method returns Promise with status code and error (if occured).
Only parameter is `command`, which is object that contain operation ID, called method and method params.

```typescript
@param { id: number; method: string; params: TYeelightParams; } command
@returns {Promise<IYeelightMethodResponse>}

device.sendCommand(command);
```


## Contributing
All contributions are appreciated. To make contribution:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/featureName`)
3. Commit your Changes (`git commit -m 'Short description'`)
4. Push to the Branch (`git push origin feature/featureName`)
5. Open a Pull Request

## Credits
* [Dawid Chróścielski](https://github.com/Chroscielski) - Code Review, suggestions about performance issues and code structure.

## License
This package is distributed under the MIT License.

