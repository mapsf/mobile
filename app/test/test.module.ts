import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { TestRoutingModule } from "./test-routing.module";
import { TestComponent } from "./test.component";

@NgModule({
    imports: [
        NativeScriptModule,
        TestRoutingModule
    ],
    declarations: [
        TestComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class TestModule { }
