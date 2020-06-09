"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YeelightDevice = void 0;
var rxjs_1 = require("rxjs");
var net = require("net");
var yeelight_interface_1 = require("./yeelight.interface");
var YeelightDevice = /** @class */ (function () {
    function YeelightDevice(host, port) {
        var _this = this;
        this.defaults = { effect: 'smooth', duration: 1000 };
        this.connected = new rxjs_1.BehaviorSubject(false);
        this.socket = new net.Socket();
        this.name = new rxjs_1.BehaviorSubject(undefined);
        this.power = new rxjs_1.BehaviorSubject(undefined);
        this.brightness = new rxjs_1.BehaviorSubject(undefined);
        this.colorTemperature = new rxjs_1.BehaviorSubject(undefined);
        this.rgb = new rxjs_1.BehaviorSubject(undefined);
        this.hue = new rxjs_1.BehaviorSubject(undefined);
        this.saturation = new rxjs_1.BehaviorSubject(undefined);
        this.colorMode = new rxjs_1.BehaviorSubject(undefined);
        this.socket.connect(port, host, function () {
            _this.connected.next(true);
        });
        this.socket.on('data', function (socketMessage) {
            _this.handleSocketMessage(socketMessage);
        });
        this.socket.on('error', function () {
            _this.destroy();
        });
    }
    YeelightDevice.prototype.destroy = function () {
        this.socket.destroy();
        this.connected.next(false);
    };
    /* Methods */
    YeelightDevice.prototype.setName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var method, params;
            return __generator(this, function (_a) {
                method = yeelight_interface_1.YeelightSupportedMethodsEnum.setName;
                params = [name];
                return [2 /*return*/, this.castMethod(method, params)];
            });
        });
    };
    YeelightDevice.prototype.setAsDefault = function () {
        return __awaiter(this, void 0, void 0, function () {
            var method;
            return __generator(this, function (_a) {
                method = yeelight_interface_1.YeelightSupportedMethodsEnum.setDefault;
                return [2 /*return*/, this.castMethod(method)];
            });
        });
    };
    YeelightDevice.prototype.togglePower = function () {
        return __awaiter(this, void 0, void 0, function () {
            var method;
            return __generator(this, function (_a) {
                method = yeelight_interface_1.YeelightSupportedMethodsEnum.toggle;
                return [2 /*return*/, this.castMethod(method)];
            });
        });
    };
    YeelightDevice.prototype.setPower = function (powerState, effect, duration) {
        if (effect === void 0) { effect = this.defaults.effect; }
        if (duration === void 0) { duration = this.defaults.duration; }
        return __awaiter(this, void 0, void 0, function () {
            var method, params;
            return __generator(this, function (_a) {
                if (!this.isEffectValid(effect)) {
                    return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.BAD_REQUEST, "Effect should be \"smooth\" or \"sudden\".")];
                }
                if (!this.isDurationValid(duration)) {
                    return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.BAD_REQUEST, "Duration should be number not lower than 300ms.")];
                }
                if (powerState !== 'on' && powerState !== 'off') {
                    return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.BAD_REQUEST, "Power parameter should be \"on\" or \"off\".")];
                }
                method = yeelight_interface_1.YeelightSupportedMethodsEnum.setPower;
                params = [powerState, effect, duration];
                return [2 /*return*/, this.castMethod(method, params)];
            });
        });
    };
    YeelightDevice.prototype.setColorTemperature = function (colorTemperature, effect, duration) {
        if (effect === void 0) { effect = this.defaults.effect; }
        if (duration === void 0) { duration = this.defaults.duration; }
        return __awaiter(this, void 0, void 0, function () {
            var method, params;
            return __generator(this, function (_a) {
                if (!this.isEffectValid(effect)) {
                    return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.BAD_REQUEST, "Effect should be \"smooth\" or \"sudden\".")];
                }
                if (!this.isDurationValid(duration)) {
                    return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.BAD_REQUEST, "Duration should be number not lower than 300ms.")];
                }
                if (!colorTemperature || colorTemperature < 2700 || colorTemperature > 6500) {
                    return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.BAD_REQUEST, "Color temperature is not a number in the range of 2700 ~ 6500.")];
                }
                method = yeelight_interface_1.YeelightSupportedMethodsEnum.setTemperature;
                params = [colorTemperature, effect, duration];
                return [2 /*return*/, this.castMethod(method, params)];
            });
        });
    };
    YeelightDevice.prototype.setRgb = function (rgb, effect, duration) {
        if (effect === void 0) { effect = this.defaults.effect; }
        if (duration === void 0) { duration = this.defaults.duration; }
        return __awaiter(this, void 0, void 0, function () {
            var method, params;
            return __generator(this, function (_a) {
                if (!this.isEffectValid(effect)) {
                    return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.BAD_REQUEST, "Effect should be \"smooth\" or \"sudden\".")];
                }
                if (!this.isDurationValid(duration)) {
                    return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.BAD_REQUEST, "Duration should be number not lower than 300ms.")];
                }
                if (typeof rgb === 'string' && rgb.match(/^(#)((?:[A-Fa-f0-9]{3}){1,2})$/)) {
                    rgb = parseInt(rgb.substring(1), 16);
                }
                if (typeof rgb === 'object') {
                    rgb = (rgb[0] << (16 + rgb[1])) << (16 + rgb[2]);
                }
                rgb = Number(rgb);
                if (isNaN(rgb) || rgb < 0 || rgb > 16777215) {
                    return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.BAD_REQUEST, "RGB color is missing or it's not valid HEX RGB Color.")];
                }
                method = yeelight_interface_1.YeelightSupportedMethodsEnum.setRgb;
                params = [rgb, effect, duration];
                return [2 /*return*/, this.castMethod(method, params)];
            });
        });
    };
    YeelightDevice.prototype.setHsv = function (hue, saturation, effect, duration) {
        if (effect === void 0) { effect = this.defaults.effect; }
        if (duration === void 0) { duration = this.defaults.duration; }
        return __awaiter(this, void 0, void 0, function () {
            var method, params;
            return __generator(this, function (_a) {
                if (!this.isEffectValid(effect)) {
                    return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.BAD_REQUEST, "Effect should be \"smooth\" or \"sudden\".")];
                }
                if (!this.isDurationValid(duration)) {
                    return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.BAD_REQUEST, "Duration should be number not lower than 300ms.")];
                }
                if (hue < 0 || hue > 359) {
                    return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.BAD_REQUEST, "Hue is missing or it's not valid hue value (range from 0 to 359).")];
                }
                if (saturation < 0 || saturation > 100) {
                    return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.BAD_REQUEST, "Saturation is missing or it's not valid saturation value (range from 0 to 100).")];
                }
                method = yeelight_interface_1.YeelightSupportedMethodsEnum.setHsv;
                params = [hue, saturation, effect, duration];
                return [2 /*return*/, this.castMethod(method, params)];
            });
        });
    };
    YeelightDevice.prototype.setBrightness = function (brightness, effect, duration) {
        if (effect === void 0) { effect = this.defaults.effect; }
        if (duration === void 0) { duration = this.defaults.duration; }
        return __awaiter(this, void 0, void 0, function () {
            var method, params;
            return __generator(this, function (_a) {
                if (!this.isEffectValid(effect)) {
                    return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.BAD_REQUEST, "Effect should be \"smooth\" or \"sudden\".")];
                }
                if (!this.isDurationValid(duration)) {
                    return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.BAD_REQUEST, "Duration should be number not lower than 300ms.")];
                }
                if (brightness < 0 || brightness > 100) {
                    return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.BAD_REQUEST, "Brigtness should be number in range from 0 to 100 (percent).")];
                }
                method = yeelight_interface_1.YeelightSupportedMethodsEnum.setBrightness;
                params = [brightness, effect, duration];
                return [2 /*return*/, this.castMethod(method, params)];
            });
        });
    };
    YeelightDevice.prototype.adjustBrightness = function (difference, effect, duration) {
        if (effect === void 0) { effect = this.defaults.effect; }
        if (duration === void 0) { duration = this.defaults.duration; }
        return __awaiter(this, void 0, void 0, function () {
            var method, params;
            return __generator(this, function (_a) {
                if (!this.isEffectValid(effect)) {
                    return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.BAD_REQUEST, "Effect should be \"smooth\" or \"sudden\".")];
                }
                if (!this.isDurationValid(duration)) {
                    return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.BAD_REQUEST, "Duration should be number not lower than 300ms.")];
                }
                if (difference < -100 || difference > 100) {
                    return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.BAD_REQUEST, "Brigtness adjustment should be number in range from -100 to 100 (percent).")];
                }
                method = yeelight_interface_1.YeelightSupportedMethodsEnum.adjustBrightness;
                params = [difference, effect, duration];
                return [2 /*return*/, this.castMethod(method, params)];
            });
        });
    };
    YeelightDevice.prototype.adjustTemperature = function (difference, effect, duration) {
        if (effect === void 0) { effect = this.defaults.effect; }
        if (duration === void 0) { duration = this.defaults.duration; }
        return __awaiter(this, void 0, void 0, function () {
            var method, params;
            return __generator(this, function (_a) {
                if (!this.isEffectValid(effect)) {
                    return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.BAD_REQUEST, "Effect should be \"smooth\" or \"sudden\".")];
                }
                if (!this.isDurationValid(duration)) {
                    return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.BAD_REQUEST, "Duration should be number not lower than 300ms.")];
                }
                if (difference < -100 || difference > 100) {
                    return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.BAD_REQUEST, "Temperature adjustment should be number in range from -100 to 100 (percent).")];
                }
                method = yeelight_interface_1.YeelightSupportedMethodsEnum.adjustTemperature;
                params = [difference, effect, duration];
                return [2 /*return*/, this.castMethod(method, params)];
            });
        });
    };
    YeelightDevice.prototype.adjustColor = function (difference, effect, duration) {
        if (effect === void 0) { effect = this.defaults.effect; }
        if (duration === void 0) { duration = this.defaults.duration; }
        return __awaiter(this, void 0, void 0, function () {
            var method, params;
            return __generator(this, function (_a) {
                if (!this.isEffectValid(effect)) {
                    return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.BAD_REQUEST, "Effect should be \"smooth\" or \"sudden\".")];
                }
                if (!this.isDurationValid(duration)) {
                    return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.BAD_REQUEST, "Duration should be number not lower than 300ms.")];
                }
                if (difference < -100 || difference > 100) {
                    return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.BAD_REQUEST, "Color adjustment should be number in range from -100 to 100 (percent).")];
                }
                method = yeelight_interface_1.YeelightSupportedMethodsEnum.adjustColor;
                params = [difference, effect, duration];
                return [2 /*return*/, this.castMethod(method, params)];
            });
        });
    };
    YeelightDevice.prototype.isDurationValid = function (duration) {
        if (isNaN(Number(duration)) || duration < 300) {
            return false;
        }
        return true;
    };
    YeelightDevice.prototype.isEffectValid = function (effect) {
        if (effect !== 'smooth' && effect !== 'sudden') {
            return false;
        }
        return true;
    };
    /* Handling data and casting methods */
    YeelightDevice.prototype.handleSocketMessage = function (socketMessage) {
        var _this = this;
        var stringSocketMessage = socketMessage.toString();
        if (stringSocketMessage.length <= 0) {
            return; // not a valid message
        }
        var stringJsons = stringSocketMessage.split(/\r?\n/).filter(Boolean);
        stringJsons.forEach(function (stringJson) {
            try {
                JSON.parse(stringJson);
            }
            catch (e) {
                return; // not a JSON object, continue
            }
            var data = JSON.parse(stringJson);
            if (data.method === 'props') {
                _this.handleProperties(data);
                return;
            }
        });
    };
    YeelightDevice.prototype.handleProperties = function (data) {
        for (var param in data.params) {
            if (!param) {
                return;
            }
            var value = data.params[param];
            switch (param) {
                case yeelight_interface_1.YeelightSupportedPropertiesEnum.power:
                    this.power.next(value);
                    break;
                case yeelight_interface_1.YeelightSupportedPropertiesEnum.brightness:
                    this.brightness.next(Number(value));
                    break;
                case yeelight_interface_1.YeelightSupportedPropertiesEnum.colorTemperature:
                    this.colorTemperature.next(Number(value));
                    break;
                case yeelight_interface_1.YeelightSupportedPropertiesEnum.rgb:
                    this.rgb.next("#" + Number(value).toString(16));
                    break;
                case yeelight_interface_1.YeelightSupportedPropertiesEnum.hue:
                    this.hue.next(Number(value));
                    break;
                case yeelight_interface_1.YeelightSupportedPropertiesEnum.saturation:
                    this.saturation.next(Number(value));
                    break;
                case yeelight_interface_1.YeelightSupportedPropertiesEnum.colorMode:
                    this.colorMode.next(Number(value));
                    break;
                case yeelight_interface_1.YeelightSupportedPropertiesEnum.name:
                    this.name.next(value);
                    break;
                default:
                    break;
            }
        }
    };
    YeelightDevice.prototype.castMethod = function (method, params) {
        var _a;
        if (params === void 0) { params = []; }
        return __awaiter(this, void 0, void 0, function () {
            var id, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = 1;
                        if (this.connected.value === false || this.socket === null) {
                            return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.DEVICE_DISCONNECTED, "Device is disconnected.")];
                        }
                        if (!this.supportedMethods.includes(method)) {
                            return [2 /*return*/, this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.METHOD_NOT_SUPPORTED, "Method " + method + " is not allowed for device " + ((_a = this.name.value) !== null && _a !== void 0 ? _a : this.model) + ".")];
                        }
                        return [4 /*yield*/, this.sendCommand({ id: id, method: method, params: params })];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    YeelightDevice.prototype.sendCommand = function (command) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var message = JSON.stringify(command);
                        _this.socket.write(message + '\r\n', 'utf-8', function () {
                            _this.socket.on('data', function (socketMessage) {
                                var stringJsons = socketMessage.toString().split(/\r?\n/).filter(Boolean);
                                for (var _i = 0, stringJsons_1 = stringJsons; _i < stringJsons_1.length; _i++) {
                                    var stringJson = stringJsons_1[_i];
                                    if (stringJson.length <= 1) {
                                        return; // invalid or empty response, continue
                                    }
                                    try {
                                        JSON.parse(stringJson);
                                    }
                                    catch (e) {
                                        return; // not a JSON object, continue
                                    }
                                    var data = JSON.parse(stringJson);
                                    if (!data.id || data.id !== 1) {
                                        return;
                                    }
                                    if (data.error) {
                                        resolve(_this.throwError(yeelight_interface_1.YeelightMethodStatusEnum.YEELIGHT_DEVICE_ERROR, data.error.message));
                                        return;
                                    }
                                    resolve(_this.setResponse(yeelight_interface_1.YeelightMethodStatusEnum.OK));
                                }
                            });
                        });
                    })];
            });
        });
    };
    /* Responses */
    YeelightDevice.prototype.setResponse = function (code) {
        return {
            status: code,
        };
    };
    YeelightDevice.prototype.throwError = function (code, message) {
        return {
            status: code,
            errorMessage: message,
        };
    };
    return YeelightDevice;
}());
exports.YeelightDevice = YeelightDevice;
