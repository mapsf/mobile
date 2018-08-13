import {Component, OnInit} from "@angular/core";
import {TokenStorageService} from "~/shared/token-storage.service";

import {registerElement} from "nativescript-angular/element-registry";
import config from './../config'
import {Location} from "nativescript-geolocation/location";
import * as geolocation from "nativescript-geolocation";
import {Accuracy} from "tns-core-modules/ui/enums";

registerElement("Mapbox", () => require("nativescript-mapbox").MapboxView);

@Component({
    selector: "app-home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    accessToken = config.mapboxAccessToken;
    location = {
        latitude: 0,
        longitude: 0,
    };

    constructor(public tokenStorage: TokenStorageService) {
    }

    ngOnInit(): void {
        geolocation.enableLocationRequest().then(() => {
            geolocation.getCurrentLocation({
                desiredAccuracy: Accuracy.high,
                maximumAge: 5000,
                timeout: 2500,
                updateTime: 1000,
            })
                .then((location: Location) => {
                    this.location.latitude = location.latitude;
                    this.location.longitude = location.longitude;
                })
                .catch(err => {
                    console.log(err);
                });
            const watchId = geolocation.watchLocation((location: Location) => {
                console.log(location);
            }, (error: Error) => {
                console.log(error);
            }, {});
        }).catch(() => {
            alert('жаль');
        });
    }

    onMapReady() {
        alert('ready!');
    }
}
