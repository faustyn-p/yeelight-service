"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YeelightMethodStatusEnum = exports.YeelightSupportedPropertiesEnum = exports.YeelightColorModeEnum = exports.YeelightSupportedMethodsEnum = exports.YeelightDeviceModelEnum = void 0;
/* Enums */
var YeelightDeviceModelEnum;
(function (YeelightDeviceModelEnum) {
    YeelightDeviceModelEnum["MONO"] = "mono";
    YeelightDeviceModelEnum["COLOR"] = "color";
    YeelightDeviceModelEnum["STRIPE"] = "stripe";
    YeelightDeviceModelEnum["CEILING"] = "ceiling";
    YeelightDeviceModelEnum["BSLAMP"] = "bslamp";
    YeelightDeviceModelEnum["LAMP1"] = "lamp1";
})(YeelightDeviceModelEnum = exports.YeelightDeviceModelEnum || (exports.YeelightDeviceModelEnum = {}));
var YeelightSupportedMethodsEnum;
(function (YeelightSupportedMethodsEnum) {
    YeelightSupportedMethodsEnum["toggle"] = "toggle";
    YeelightSupportedMethodsEnum["setTemperature"] = "set_ct_abx";
    YeelightSupportedMethodsEnum["setRgb"] = "set_rgb";
    YeelightSupportedMethodsEnum["setHsv"] = "set_hsv";
    YeelightSupportedMethodsEnum["setBrightness"] = "set_bright";
    YeelightSupportedMethodsEnum["setPower"] = "set_power";
    YeelightSupportedMethodsEnum["setDefault"] = "set_default";
    YeelightSupportedMethodsEnum["setName"] = "set_name";
    YeelightSupportedMethodsEnum["adjustBrightness"] = "adjust_bright";
    YeelightSupportedMethodsEnum["adjustTemperature"] = "adjust_ct";
    YeelightSupportedMethodsEnum["adjustColor"] = "adjust_color";
})(YeelightSupportedMethodsEnum = exports.YeelightSupportedMethodsEnum || (exports.YeelightSupportedMethodsEnum = {}));
var YeelightColorModeEnum;
(function (YeelightColorModeEnum) {
    YeelightColorModeEnum[YeelightColorModeEnum["RGB"] = 1] = "RGB";
    YeelightColorModeEnum[YeelightColorModeEnum["COLOR_TEMPERATURE"] = 2] = "COLOR_TEMPERATURE";
    YeelightColorModeEnum[YeelightColorModeEnum["HSV"] = 3] = "HSV";
})(YeelightColorModeEnum = exports.YeelightColorModeEnum || (exports.YeelightColorModeEnum = {}));
var YeelightSupportedPropertiesEnum;
(function (YeelightSupportedPropertiesEnum) {
    /**
     * Current state of LED light
     * @returns {string} `on` - smart LED is turned on.
     * @returns {string} `off` - smart LED is turned off.
     */
    YeelightSupportedPropertiesEnum["power"] = "power";
    /**
     * Current brightness of LED light (in percentage)
     * @returns {number} Range `1` ~ `100` percent.
     */
    YeelightSupportedPropertiesEnum["brightness"] = "bright";
    /**
     * Current color temperature of LED light (in Kelvin)
     * @returns {number} Range `1700` ~ `6500` Kelvin.
     */
    YeelightSupportedPropertiesEnum["colorTemperature"] = "ct";
    /**
     * Current RGB color of LED light (in HEX)
     * @returns {string} HEX Color.
     */
    YeelightSupportedPropertiesEnum["rgb"] = "rgb";
    /**
     * Current hue of LED light (in degrees)
     * @returns {number} Range `0` ~ `359` degree.
     */
    YeelightSupportedPropertiesEnum["hue"] = "hue";
    /**
     * Current saturation of LED light
     * @returns {number} Range `0` ~ `100`.
     */
    YeelightSupportedPropertiesEnum["saturation"] = "sat";
    /**
     * LED light color mode. Returns color mode as integer:
     * @returns {number} `1` - rgb mode
     * @returns {number} `2` - color temperature mode
     * @returns {number} `3` - hsv mode
     */
    YeelightSupportedPropertiesEnum["colorMode"] = "color_mode";
    /**
     * Fiendly-name of the device
     * @returns {string} Name of the device.
     */
    YeelightSupportedPropertiesEnum["name"] = "name";
})(YeelightSupportedPropertiesEnum = exports.YeelightSupportedPropertiesEnum || (exports.YeelightSupportedPropertiesEnum = {}));
var YeelightMethodStatusEnum;
(function (YeelightMethodStatusEnum) {
    /**
     * The device accepted the command correctly. However, this does not necessarily mean that the command has been carried out by the device.
     */
    YeelightMethodStatusEnum[YeelightMethodStatusEnum["OK"] = 200] = "OK";
    /**
     * One or more parameters passed are invalid.
     */
    YeelightMethodStatusEnum[YeelightMethodStatusEnum["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    /**
     * Selected method is not supported by the device (e.g. method for change color is not supported by non-color device). Supported methods for the device can be accessed by `supportedMethods` parameter of the device.
     */
    YeelightMethodStatusEnum[YeelightMethodStatusEnum["METHOD_NOT_SUPPORTED"] = 405] = "METHOD_NOT_SUPPORTED";
    /**
     * An exception thrown when trying to call a method on a disconnected device.
     */
    YeelightMethodStatusEnum[YeelightMethodStatusEnum["DEVICE_DISCONNECTED"] = 410] = "DEVICE_DISCONNECTED";
    /**
     * An exception thrown when the built-in validators did not find an error in the query, and yet it cannot be executed by the device for some reason. In this case, check `errorMessage` for more details.
     */
    YeelightMethodStatusEnum[YeelightMethodStatusEnum["YEELIGHT_DEVICE_ERROR"] = 500] = "YEELIGHT_DEVICE_ERROR";
})(YeelightMethodStatusEnum = exports.YeelightMethodStatusEnum || (exports.YeelightMethodStatusEnum = {}));
