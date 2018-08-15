import {NgModule, NgModuleFactoryLoader, NO_ERRORS_SCHEMA} from "@angular/core";
import {NativeScriptModule} from "nativescript-angular/nativescript.module";
import {NativeScriptHttpClientModule} from "nativescript-angular/http-client";
import {NativeScriptFormsModule} from "nativescript-angular/forms";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {LoginComponent} from "./login/login.component";

import {UserService} from "./shared/user.service";
import {ApiService} from "~/shared/api.service";
import {AuthTokenService} from "~/shared/auth-token.service";
import {GeoLocationService} from "~/shared/geo-location.service";
import {WebSocketService} from "~/shared/web-socket.service";
import {LocalStorageService} from "~/shared/local-storage.service";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptFormsModule,
        NativeScriptHttpClientModule,
        AppRoutingModule,
    ],
    declarations: [
        AppComponent,
        LoginComponent,
    ],
    providers: [
        UserService,
        ApiService,
        AuthTokenService,
        GeoLocationService,
        WebSocketService,
        LocalStorageService,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})

export class AppModule {
}
