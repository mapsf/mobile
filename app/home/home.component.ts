import {Component, OnInit} from "@angular/core";

import config from './../config'
import {Location} from "nativescript-geolocation/location";
import {GeoLocationService} from "~/shared/geo-location.service";

import {registerElement} from "nativescript-angular/element-registry";

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

    constructor(private geoLocation: GeoLocationService) {
    }

    ngOnInit(): void {
        this.geoLocation.enableLocationTap()
            .then((location: Location) => {
                console.log(location);
                this.location.latitude = location.latitude;
                this.location.longitude = location.longitude;
            })
            .catch((err) => {
                alert(err.message);
            });
    }

    onMapReady() {

    }
}
