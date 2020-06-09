import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs';

/* Interfaces */
export interface IYeelightDevice {
	/**
	 * @returns {BehaviorSubject<boolean>} Returns connected state of device.
	 */
	connected: BehaviorSubject<boolean>;

	/**
	 * @returns {string} Unique ID of the device.
	 */
	id: string;

	/**
	 * @returns {BehaviorSubject<string>} Returns device friendly-name
	 */
	model: YeelightDeviceModelEnum;

	/**
	 * @returns {YeelightSupportedMethodsEnum[]} Returns list of supported methods for this device. If you run method, that is not listed here, error will be returned.
	 */
	supportedMethods: YeelightSupportedMethodsEnum[];

	/**
	 * @returns {BehaviorSubject<string>} Returns device friendly-name
	 */
	name: BehaviorSubject<string>;

	/**
	 * @returns {BehaviorSubject<YeelightPowerState>} Returns device power state - `on` or `off`
	 */
	power: BehaviorSubject<YeelightPowerState>;

	/**
	 * @returns {BehaviorSubject<number>} Returns brightness of the device (in percent 0 - 100)
	 */
	brightness: BehaviorSubject<number>;

	/**
	 * @returns {BehaviorSubject<number>} Returns color temperature of the device (in Kelvin of range from 2700 to 6500)
	 */
	colorTemperature: BehaviorSubject<number>;

	/**
	 * @returns {BehaviorSubject<number>} Returns RGB color (in RGB Hex)
	 */
	rgb: BehaviorSubject<string>;

	/**
	 * @returns {BehaviorSubject<string>} Returns hue of the device (in degrees 0 - 359)
	 */
	hue: BehaviorSubject<number>;

	/**
	 * @returns {BehaviorSubject<number>} Returns saturation of the device (0 - 100)
	 */
	saturation: BehaviorSubject<number>;

	/**
	 * @returns {BehaviorSubject<YeelightColorModeEnum>} Returns color mode of the device
	 */
	colorMode: BehaviorSubject<YeelightColorModeEnum>;

	/**
	 * Destroys current device and it's socket connection
	 */
	destroy: () => void;

	/**
	 * Set name of the device
	 * @param {string} name New friendly-name of the device
	 * @returns {Promise<IYeelightMethodResponse>} Response with status code (and an error if occured)
	 */
	setName: (name: string) => Promise<IYeelightMethodResponse>;

	/**
	 * Set power of the device
	 * @param {YeelightPowerState} power `on` or `off`
	 * @param {YeelightEffect} effect Optional parameter with effect - `smooth` or `sudden`
	 * @param {number} duration Optional parameter with duration (in ms)
	 * @returns {Promise<IYeelightMethodResponse>} Response with status code (and an error if occured)
	 */
	setPower: (power: YeelightPowerState, effect?: YeelightEffect, duration?: number) => Promise<IYeelightMethodResponse>;

	/**
	 * Set color temperature of the device
	 * @param {number} colorTemperature Number in the range from 2700 to 6500 (Kelvin)
	 * @param {YeelightEffect} effect Optional parameter with effect - `smooth` or `sudden`
	 * @param {number} duration Optional parameter with duration (in ms)
	 * @returns {Promise<IYeelightMethodResponse>} Response with status code (and an error if occured)
	 */
	setColorTemperature: (colorTemperature: number, effect?: YeelightEffect, duration?: number) => Promise<IYeelightMethodResponse>;

	/**
	 * Set RGB color of the device
	 * @param {string | number | number[]} rgb RGB Color. It can be hex color ("#FFFFFF"), number (16777215) or array of numbers ([255, 255, 255])
	 * @param {YeelightEffect} effect Optional parameter with effect - `smooth` or `sudden`
	 * @param {number} duration Optional parameter with duration (in ms)
	 * @returns {Promise<IYeelightMethodResponse>} Response with status code (and an error if occured)
	 */
	setRgb: (rgb: string | number | number[], effect?: YeelightEffect, duration?: number) => Promise<IYeelightMethodResponse>;

	/**
	 * Set hue and saturation of the device
	 * @param {number} hue Number in the range from 0 to 359 (degrees)
	 * @param {number} saturation Number in the range from 0 to 100
	 * @param {YeelightEffect} effect Optional parameter with effect - `smooth` or `sudden`
	 * @param {number} duration Optional parameter with duration (in ms)
	 * @returns {Promise<IYeelightMethodResponse>} Response with status code (and an error if occured)
	 */
	setHsv: (hue: number, saturation: number, effect?: YeelightEffect, duration?: number) => Promise<IYeelightMethodResponse>;

	/**
	 * Set brightness of the device
	 * @param {number} brightness Number in the range from 0 to 359 (percent)
	 * @param {YeelightEffect} effect Optional parameter with effect - `smooth` or `sudden`
	 * @param {number} duration Optional parameter with duration (in ms)
	 * @returns {Promise<IYeelightMethodResponse>} Response with status code (and an error if occured)
	 */
	setBrightness: (brightness: number, effect?: YeelightEffect, duration?: number) => Promise<IYeelightMethodResponse>;

	/**
	 * Set current device state as default
	 * @returns {Promise<IYeelightMethodResponse>} Response with status code (and an error if occured)
	 */
	setAsDefault: () => Promise<IYeelightMethodResponse>;

	/**
	 * Toggle current device power state.
	 * @returns {Promise<IYeelightMethodResponse>} Response with status code (and an error if occured)
	 */
	togglePower: () => Promise<IYeelightMethodResponse>;

	/**
	 * Adjust brightness of the device
	 * @param {number} difference Number in the range from -100 to 100 (percent)
	 * @param {YeelightEffect} effect Optional parameter with effect - `smooth` or `sudden`
	 * @param {number} duration Optional parameter with duration (in ms)
	 * @returns {Promise<IYeelightMethodResponse>} Response with status code (and an error if occured)
	 */
	adjustBrightness: (difference: number, effect?: YeelightEffect, duration?: number) => Promise<IYeelightMethodResponse>;

	/**
	 * Adjust color temperature of the device
	 * @param {number} difference Number in the range from -100 to 100 (percent)
	 * @param {YeelightEffect} effect Optional parameter with effect - `smooth` or `sudden`
	 * @param {number} duration Optional parameter with duration (in ms)
	 * @returns {Promise<IYeelightMethodResponse>} Response with status code (and an error if occured)
	 */
	adjustTemperature: (difference: number, effect?: YeelightEffect, duration?: number) => Promise<IYeelightMethodResponse>;

	/**
	 * Adjust color of the device
	 * @param {number} difference Number in the range from -100 to 100 (percent)
	 * @param {YeelightEffect} effect Optional parameter with effect - `smooth` or `sudden`
	 * @param {number} duration Optional parameter with duration (in ms)
	 * @returns {Promise<IYeelightMethodResponse>} Response with status code (and an error if occured)
	 */
	adjustColor: (difference: number, effect?: YeelightEffect, duration?: number) => Promise<IYeelightMethodResponse>;

	/**
	 * Send custom command supported by the device (https://www.yeelight.com/download/Yeelight_Inter-Operation_Spec.pdf)
	 * @param {id: number, method: string, params: TYeelightParams} command Command that should be send to device.
	 * @param {(response: IYeelightMethodResponse) => void} callback Callback after operation finished
	 */
	sendCommand: (command: { id: number; method: string; params: TYeelightParams }) => Promise<IYeelightMethodResponse>
}

export interface IYeelight {
	devices: BehaviorSubject<IYeelightDevice[]>;
	/**
	 * Get device with given name. If there are two or more devices with given name, this function will return only first one.
	 * @param {string}
	 * Name of device
	 * @returns {Observable<IYeelightDevice>}
	 * Behaviour subject of device
	 */
	getDeviceByName: (name: string) => Observable<IYeelightDevice>;

	/**
	 * Get device with defined model. If there are two or more devices with given name, this function will return only first one.
	 * @param {string}
	 * Name of device
	 * @returns {Observable<IYeelightDevice>}
	 * Behaviour subject of device
	 */
	getDeviceByModel: (model: string) => Observable<IYeelightDevice>;
}

export interface IYeelightMethodResponse {
	/**
	 * Status code of operation. See YeelightMethodStatusEnum for more details.
	 */
	status: YeelightMethodStatusEnum;
	/**
	 * If error occured, reason will be provided here.
	 */
	errorMessage?: string;
}

export interface IYeelightResponse {
	[key: string]: string | number;
}

/* Types */
export type TYeelightParams = (string | number)[];

export type YeelightPowerState = 'on' | 'off';

export type YeelightEffect = 'smooth' | 'sudden';

/* Enums */
export enum YeelightDeviceModelEnum {
	MONO = 'mono',
	COLOR = 'color',
	STRIPE = 'stripe',
	CEILING = 'ceiling',
	BSLAMP = 'bslamp',
	LAMP1 = 'lamp1',
}

export enum YeelightSupportedMethodsEnum {
	toggle = 'toggle',
	setTemperature = 'set_ct_abx',
	setRgb = 'set_rgb',
	setHsv = 'set_hsv',
	setBrightness = 'set_bright',
	setPower = 'set_power',
	setDefault = 'set_default',
	setName = 'set_name',
	adjustBrightness = 'adjust_bright',
	adjustTemperature = 'adjust_ct',
	adjustColor = 'adjust_color',
}

export enum YeelightColorModeEnum {
	RGB = 1,
	COLOR_TEMPERATURE = 2,
	HSV = 3
}

export enum YeelightSupportedPropertiesEnum {
	/**
	 * Current state of LED light
	 * @returns {string} `on` - smart LED is turned on.
	 * @returns {string} `off` - smart LED is turned off.
	 */
	power = 'power',

	/**
	 * Current brightness of LED light (in percentage)
	 * @returns {number} Range `1` ~ `100` percent.
	 */
	brightness = 'bright',

	/**
	 * Current color temperature of LED light (in Kelvin)
	 * @returns {number} Range `1700` ~ `6500` Kelvin.
	 */
	colorTemperature = 'ct',

	/**
	 * Current RGB color of LED light (in HEX)
	 * @returns {string} HEX Color.
	 */
	rgb = 'rgb',

	/**
	 * Current hue of LED light (in degrees)
	 * @returns {number} Range `0` ~ `359` degree.
	 */
	hue = 'hue',

	/**
	 * Current saturation of LED light
	 * @returns {number} Range `0` ~ `100`.
	 */
	saturation = 'sat',

	/**
	 * LED light color mode. Returns color mode as integer:
	 * @returns {number} `1` - rgb mode
	 * @returns {number} `2` - color temperature mode
	 * @returns {number} `3` - hsv mode
	 */
	colorMode = 'color_mode',

	/**
	 * Fiendly-name of the device
	 * @returns {string} Name of the device.
	 */
	name = 'name',
}

export enum YeelightMethodStatusEnum {
	/**
	 * The device accepted the command correctly. However, this does not necessarily mean that the command has been carried out by the device.
	 */
	'OK' = 200,

	/**
	 * One or more parameters passed are invalid.
	 */
	'BAD_REQUEST' = 400,

	/**
	 * Selected method is not supported by the device (e.g. method for change color is not supported by non-color device). Supported methods for the device can be accessed by `supportedMethods` parameter of the device.
	 */
	'METHOD_NOT_SUPPORTED' = 405,

	/**
	 * An exception thrown when trying to call a method on a disconnected device.
	 */
	'DEVICE_DISCONNECTED' = 410,

	/**
	 * An exception thrown when the built-in validators did not find an error in the query, and yet it cannot be executed by the device for some reason. In this case, check `errorMessage` for more details.
	 */
	'YEELIGHT_DEVICE_ERROR' = 500,
}
