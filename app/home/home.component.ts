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
import {MapboxMarker, SetCenterOptions} from "nativescript-mapbox/mapbox.common";
import {Mapbox} from "nativescript-mapbox/mapbox.ios";
import {SetZoomLevelOptions} from "nativescript-mapbox";

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

    private defaultZoom = 15.5;

    public mapOptions: MapOptions = {
        accessToken: config.mapboxAccessToken,
        zoomLevel: this.defaultZoom,
        style: 'mapbox://styles/jilexandr/cjkp56ms107op2sn3qypmdwzi',
        location: {
            latitude: 0,
            longitude: 0,
        },
    };

    private myMarker: MapboxMarker;

    constructor(private geoLocation: GeoLocationService,
                private ws: WebSocketService,
                private page: Page,
                private authToken: AuthTokenService,) {
        this.page.actionBarHidden = true;
    }

    ngOnInit(): void {
        this.ws.connect()
            .then(() => {
                this.ws.on('pong', () => {

                });
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

    private getMapbox(): Mapbox {
        return this.mapbox.nativeElement;
    }

    onMapReady() {
        this.geoLocation.watch()
            .then((location: Location) => {

                const mb: Mapbox = this.getMapbox();

                this.mapOptions.location.latitude = location.latitude;
                this.mapOptions.location.longitude = location.longitude;
                console.log(this.mapOptions.location);

                if (!this.myMarker) {
                    this.myMarker = <MapboxMarker>{
                        lat: this.mapOptions.location.latitude,
                        lng: this.mapOptions.location.longitude,
                        title: "Это вы",
                        subtitle: "персонаж",
                        onCalloutTap: () => {
                            alert('Clicked on marker');
                        }
                    };
                    mb.addMarkers([this.myMarker]);
                    mb.setCenter(<SetCenterOptions>{lat: this.myMarker.lat, lng: this.myMarker.lng});
                } else {
                    this.myMarker.update(<MapboxMarker>{
                        lat: this.myMarker.lat,
                        lng: this.myMarker.lng,
                    });
                }
            })
            .catch((err: Error) => {
                alert(err.message);
            });
    }

    whereAmI() {
        if (!this.myMarker) {
            alert('Маркер не определен!');
            return;
        }
        this.getMapbox().setCenter(<SetCenterOptions>{lat: this.myMarker.lat, lng: this.myMarker.lng});
        this.getMapbox().setZoomLevel(<SetZoomLevelOptions>{level: this.defaultZoom});
    }

    wsc() {
        this.ws.connect()
            .then(() => {
                alert('connected');
            })
            .catch((err: ErrorEvent) => {
                alert(err.message);
            });
    }
}
