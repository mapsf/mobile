import {NgModule, NgModuleFactoryLoader, NO_ERRORS_SCHEMA} from "@angular/core";
import {NativeScriptModule} from "nativescript-angular/nativescript.module";
import {NativeScriptHttpClientModule} from "nativescript-angular/http-client";
import {NativeScriptFormsModule} from "nativescript-angular/forms";
import {NativeScriptUISideDrawerModule} from "nativescript-ui-sidedrawer/angular";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {LoginComponent} from "./login/login.component";

import {UserService} from "./shared/user.service";
import {ApiService} from "~/shared/api.service";
import {TokenStorageService} from "~/shared/token-storage.service";
import {GeoLocationService} from "~/shared/geo-location.service";
import {WebSocketService} from "~/shared/web-socket.service";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptHttpClientModule,
        AppRoutingModule,
        NativeScriptUISideDrawerModule,
    ],
    declarations: [
        AppComponent,
        LoginComponent,
    ],
    providers: [
        UserService,
        ApiService,
        TokenStorageService,
        GeoLocationService,
        WebSocketService,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})

export class AppModule {
}
