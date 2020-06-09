"use strict";
/*
Service based on official Yeelight API Specification:
https://www.yeelight.com/download/Yeelight_Inter-Operation_Spec.pdf
*/
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YeelightService = void 0;
var ip = require("ip");
var dgram = require("dgram");
var yeelight_interface_1 = require("./yeelight.interface");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var device_class_1 = require("./device.class");
var YeelightService = /** @class */ (function () {
    function YeelightService() {
        var _this = this;
        this.socket = dgram.createSocket('udp4');
        this.options = { port: 1982, multicastAddr: '239.255.255.250', discoveryMsg: 'M-SEARCH * HTTP/1.1\r\nMAN: "ssdp:discover"\r\nST: wifi_bulb\r\n' };
        this.devices = new rxjs_1.BehaviorSubject([]);
        this.listen();
        this.socket.on('message', function (message, address) {
            if (ip.address() === address.address) {
                return;
            }
            _this.handleDiscovery(message);
        });
    }
    YeelightService.prototype.getDeviceByName = function (name) {
        return this.devices.pipe(operators_1.map(function (devices) { return devices.find(function (device) { return device.name.value === name; }); }), operators_1.filter(function (value) { return !!value; }));
    };
    YeelightService.prototype.getDeviceByModel = function (model) {
        return this.devices.pipe(operators_1.map(function (devices) { return devices.find(function (device) { return device.model === model; }); }), operators_1.filter(function (value) { return !!value; }));
    };
    YeelightService.prototype.destroy = function () {
        this.devices.value.forEach(function (device) {
            device.destroy();
        });
        this.socket.disconnect();
    };
    YeelightService.prototype.listen = function () {
        var _this = this;
        try {
            this.socket.bind(this.options.port, function () {
                _this.socket.setBroadcast(true);
            });
            var buffer = Buffer.from(this.options.discoveryMsg);
            this.socket.send(buffer, 0, buffer.length, this.options.port, this.options.multicastAddr);
        }
        catch (ex) {
            return;
        }
    };
    YeelightService.prototype.handleDiscovery = function (message) {
        var _a;
        try {
            message.toString().split('\r\n');
        }
        catch (e) {
            return; // not a valid discovery message
        }
        var headers = message.toString().split('\r\n');
        var host = this.getHostFromHeaders(headers);
        var port = this.getPortFromHeaders(headers);
        if (!host || !port) {
            return;
        }
        var device = new device_class_1.YeelightDevice(host, port);
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
        var deviceIndex = (_a = this.devices) === null || _a === void 0 ? void 0 : _a.value.findIndex(function (registeredDevice) { return registeredDevice.id === device.id; });
        if (deviceIndex >= 0) {
            this.devices.value[deviceIndex] = device;
            return;
        }
        this.devices.next(__spreadArrays(this.devices.value, [device]));
    };
    YeelightService.prototype.splitHeader = function (header) {
        var separatedKayAndValue = header.split(': ');
        if (separatedKayAndValue.length < 2) {
            return;
        }
        var key = separatedKayAndValue.shift().toLowerCase();
        var value = separatedKayAndValue.join(':');
        return { key: key, value: value };
    };
    YeelightService.prototype.getFromHeaders = function (parameter, headers) {
        var header = headers.find(function (singleHeader) { return singleHeader.indexOf(parameter + ":") >= 0; });
        var keyAndValue = this.splitHeader(header);
        return keyAndValue;
    };
    YeelightService.prototype.getHostFromHeaders = function (headers) {
        var location = this.getFromHeaders('Location', headers);
        if (!(location === null || location === void 0 ? void 0 : location.value)) {
            return;
        }
        var partedLocation = location.value.split(':');
        if (partedLocation.length < 2) {
            return;
        }
        return partedLocation[1].replace('//', '');
    };
    YeelightService.prototype.getPortFromHeaders = function (headers) {
        var location = this.getFromHeaders('Location', headers);
        if (!(location === null || location === void 0 ? void 0 : location.value)) {
            return;
        }
        var partedLocation = location.value.split(':');
        if (partedLocation.length < 3) {
            return;
        }
        return Number(partedLocation[2]);
    };
    YeelightService.prototype.getIdFromHeaders = function (headers) {
        var id = this.getFromHeaders('id', headers);
        if (!(id === null || id === void 0 ? void 0 : id.value)) {
            return;
        }
        return id.value;
    };
    YeelightService.prototype.getModelFromHeaders = function (headers) {
        var model = this.getFromHeaders('model', headers);
        if (!(model === null || model === void 0 ? void 0 : model.value)) {
            return;
        }
        return model.value;
    };
    YeelightService.prototype.getNameFromHeaders = function (headers) {
        var name = this.getFromHeaders('name', headers);
        if (!(name === null || name === void 0 ? void 0 : name.value)) {
            return;
        }
        return name.value;
    };
    YeelightService.prototype.getPowerFromHeaders = function (headers) {
        var power = this.getFromHeaders('power', headers);
        if (!(power === null || power === void 0 ? void 0 : power.value) || (power.value !== 'on' && power.value !== 'off')) {
            return;
        }
        return power.value;
    };
    YeelightService.prototype.getSupportedMethodsFromHeaders = function (headers) {
        var support = this.getFromHeaders('support', headers);
        if (!(support === null || support === void 0 ? void 0 : support.value)) {
            return;
        }
        var supportedMethods = support.value.split(' ');
        return supportedMethods;
    };
    YeelightService.prototype.getBrightnessFromHeaders = function (headers) {
        var brightness = this.getFromHeaders('bright', headers);
        if (!(brightness === null || brightness === void 0 ? void 0 : brightness.value)) {
            return;
        }
        return Number(brightness.value);
    };
    YeelightService.prototype.getColorModeFromHeaders = function (headers) {
        var colorMode = this.getFromHeaders('color_mode', headers);
        if (!(colorMode === null || colorMode === void 0 ? void 0 : colorMode.value) || !Object.values(yeelight_interface_1.YeelightColorModeEnum).includes(colorMode.value)) {
            return;
        }
        return Number(colorMode.value);
    };
    YeelightService.prototype.getColorTemperatureFromHeaders = function (headers) {
        var colorTemperature = this.getFromHeaders('ct', headers);
        if (!(colorTemperature === null || colorTemperature === void 0 ? void 0 : colorTemperature.value)) {
            return;
        }
        return Number(colorTemperature.value);
    };
    YeelightService.prototype.getHueFromHeaders = function (headers) {
        var hue = this.getFromHeaders('hue', headers);
        if (!(hue === null || hue === void 0 ? void 0 : hue.value)) {
            return;
        }
        return Number(hue.value);
    };
    YeelightService.prototype.getRgbFromHeaders = function (headers) {
        var rgb = this.getFromHeaders('rgb', headers);
        if (!(rgb === null || rgb === void 0 ? void 0 : rgb.value)) {
            return;
        }
        return "#" + Number(rgb.value).toString(16);
    };
    YeelightService.prototype.getSaturationFromHeaders = function (headers) {
        var saturation = this.getFromHeaders('sat', headers);
        if (!(saturation === null || saturation === void 0 ? void 0 : saturation.value)) {
            return;
        }
        return Number(saturation.value);
    };
    return YeelightService;
}());
exports.YeelightService = YeelightService;
