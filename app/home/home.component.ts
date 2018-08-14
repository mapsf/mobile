import {Component, OnDestroy, OnInit, ViewChild, ElementRef, ChangeDetectorRef} from "@angular/core";

import config from './../config'
import {Location} from "nativescript-geolocation/location";
import {GeoLocationService} from "~/shared/geo-location.service";

import {registerElement} from "nativescript-angular/element-registry";
import {GeoPosition} from "~/shared/geo-position.model";
import {WebSocketService} from "~/shared/web-socket.service";
import {RadSideDrawerComponent} from "nativescript-ui-sidedrawer/angular";
import {RadSideDrawer} from "nativescript-ui-sidedrawer";

registerElement("Mapbox", () => require("nativescript-mapbox").MapboxView);

@Component({
    selector: "app-home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

    private drawer: RadSideDrawer;
    private _mainContentText: string;

    @ViewChild("map") public mapbox: ElementRef;
    @ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;

    public accessToken = config.mapboxAccessToken;

    public location: GeoPosition = {
        latitude: 49.4219317,
        longitude: 32.1047533,
    };

    constructor(private geoLocation: GeoLocationService, private ws: WebSocketService, private _changeDetectionRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.mainContentText = "SideDrawer for NativeScript can be easily setup in the HTML definition of your page by defining tkDrawerContent and tkMainContent. The component has a default transition and position and also exposes notifications related to changes in its state. Swipe from left to open side drawer.";
        this.ws.connect()
            .then(() => {
                this.ws.send('ping');
                alert('connected');
            })
            .catch((err: ErrorEvent) => {
                alert(err.message);
            });
    }

    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
    }

    ngOnDestroy(): void {
        this.geoLocation.stopWatch();
    }

    get mainContentText() {
        return this._mainContentText;
    }

    set mainContentText(value: string) {
        this._mainContentText = value;
    }

    public openDrawer() {
        this.drawer.showDrawer();
    }

    public onCloseDrawerTap() {
        this.drawer.closeDrawer();
    }

    onMapReady() {
        this.geoLocation.watch()
            .then((location: Location) => {
                this.location.latitude = location.latitude;
                this.location.longitude = location.longitude;
                console.log(this.location);
                this.mapbox.nativeElement.addMarkers([{
                    lat: this.location.latitude,
                    lng: this.location.longitude,
                    title: "Это вы",
                    subtitle: "Home of The Polyglot Developer!",
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
