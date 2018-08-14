import {Injectable} from "@angular/core";
import * as geolocation from "nativescript-geolocation";
import {Accuracy} from "tns-core-modules/ui/enums";
import {Location} from "nativescript-geolocation/location";
import {Options} from "nativescript-geolocation/location-monitor";

@Injectable()
export class GeoLocationService {

    private options: Options = {
        desiredAccuracy: Accuracy.high,
        maximumAge: 5000,
        timeout: 2500,
        updateTime: 1000,
    };

    private watchOptions: Options = {
        desiredAccuracy: 3,
        updateDistance: 10,
        minimumUpdateTime: 1000 * 20, // Should update every 20 seconds according to Googe documentation. Not verified.
    };

    private locationWatchId: number;

    public watch(): Promise<Location> {
        return new Promise((resolve, reject) => {
            geolocation.isEnabled().then((isEnabled) => {
                if (!isEnabled) {
                    geolocation.enableLocationRequest()
                        .then(() => this.watchLocation(resolve, reject))
                        .catch(reject);
                } else {
                    this.watchLocation(resolve, reject);
                }
            }).catch(reject);
        });
    }

    private watchLocation(resolve, reject): void {

        geolocation.getCurrentLocation(this.options).then(resolve).catch(reject);

        this.locationWatchId = geolocation.watchLocation(
            resolve,
            (err: Error) => reject(err),
            this.watchOptions
        );
    }

    public stopWatch(): void {
        geolocation.clearWatch(this.locationWatchId);
    }
}
