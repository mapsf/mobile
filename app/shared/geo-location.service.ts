import {Injectable} from "@angular/core";
import * as geolocation from "nativescript-geolocation";
import {Accuracy} from "tns-core-modules/ui/enums";
import {Location} from "nativescript-geolocation/location";

@Injectable()
export class GeoLocationService {

    private options = {
        desiredAccuracy: Accuracy.high,
        maximumAge: 5000,
        timeout: 2500,
        updateTime: 1000,
    };

    public enableLocationTap(): Promise<Location> {
        return new Promise(function (resolve, reject) {
            geolocation.isEnabled().then(function (isEnabled: boolean) {
                if (!isEnabled) {
                    geolocation.enableLocationRequest().then(() => {
                        geolocation.getCurrentLocation(this.options)
                            .then((location: Location) => {
                                resolve(location);
                            })
                            .catch(err => {
                                reject(err);
                            });
                        resolve();
                    }, function (err) {
                        reject(err);
                    });
                }
            }, function (err) {
                reject(err);
            });
        });
    }

    private getLocation() {
        const watchId = geolocation.watchLocation((location: Location) => {
            console.log(location);
        }, (error: Error) => {
            console.log(error);
        }, {});
    }
}
