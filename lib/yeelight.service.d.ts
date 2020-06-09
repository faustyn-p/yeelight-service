import { IYeelight, IYeelightDevice } from './yeelight.interface';
import { BehaviorSubject, Observable } from 'rxjs';
export declare class YeelightService implements IYeelight {
    private readonly socket;
    private readonly options;
    devices: BehaviorSubject<IYeelightDevice[]>;
    constructor();
    getDeviceByName(name: string): Observable<IYeelightDevice>;
    getDeviceByModel(model: string): Observable<IYeelightDevice>;
    destroy(): void;
    private listen;
    private handleDiscovery;
    private splitHeader;
    private getFromHeaders;
    private getHostFromHeaders;
    private getPortFromHeaders;
    private getIdFromHeaders;
    private getModelFromHeaders;
    private getNameFromHeaders;
    private getPowerFromHeaders;
    private getSupportedMethodsFromHeaders;
    private getBrightnessFromHeaders;
    private getColorModeFromHeaders;
    private getColorTemperatureFromHeaders;
    private getHueFromHeaders;
    private getRgbFromHeaders;
    private getSaturationFromHeaders;
}
