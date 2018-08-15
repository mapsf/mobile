import {Component, OnDestroy, OnInit, ViewChild, ElementRef} from "@angular/core";

import config from './../config'
import {Location} from "nativescript-geolocation/location";
import {GeoLocationService} from "~/shared/geo-location.service";

import {registerElement} from "nativescript-angular/element-registry";
import {GeoPosition} from "~/shared/geo-position.model";
import {WebSocketService} from "~/shared/web-socket.service";
import {Page} from "ui/page"
import {MapOptions} from "~/common/interfaces/map";
import {AuthTokenService} from "~/shared/auth-token.service";

registerElement("Mapbox", () => require("nativescript-mapbox").MapboxView);

const orientation = require('nativescript-orientation');

orientation.setFullScreen(true);
orientation.setOrientation("landscape");

@Component({
    selector: "app-home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {

    @ViewChild("map") public mapbox: ElementRef;

    public mapOptions: MapOptions = {
        accessToken: config.mapboxAccessToken,
        zoomLevel: 15.5,
        style: 'mapbox://styles/jilexandr/cjkp56ms107op2sn3qypmdwzi',
        location: {
            latitude: 49.4219317,
            longitude: 32.1047533,
        },
    };

    constructor(private geoLocation: GeoLocationService,
                private ws: WebSocketService,
                private page: Page,
                private authToken: AuthTokenService,) {
        this.page.actionBarHidden = true;
    }

    ngOnInit(): void {
        alert(this.authToken.get());
        this.ws.connect()
            .then(() => {
                this.ws.send('ping');
                alert('connected');
            })
            .catch((err: ErrorEvent) => {
                alert(err.message);
            });
    }

    ngOnDestroy(): void {
        this.geoLocation.stopWatch();
        this.ws.close();
    }

    onMapReady() {
        this.geoLocation.watch()
            .then((location: Location) => {
                this.mapOptions.location.latitude = location.latitude;
                this.mapOptions.location.longitude = location.longitude;
                console.log(this.mapOptions.location);
                // TODO add watcher
                this.mapbox.nativeElement.addMarkers([{
                    lat: this.mapOptions.location.latitude,
                    lng: this.mapOptions.location.longitude,
                    title: "Это вы",
                    subtitle: "персонаж",
                    onCalloutTap: () => {
                        alert('Clicked on marker');
                    }
                }]);
            })
            .catch((err: Error) => {
                alert(err.message);
            });
    }
}
