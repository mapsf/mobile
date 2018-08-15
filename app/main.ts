// this import should be first in order to load some required settings (like globals and reflect-metadata)
import {platformNativeScriptDynamic} from "nativescript-angular/platform";
import {enableProdMode} from '@angular/core';

import {AppModule} from "./app.module";
import {AppOptions} from "nativescript-angular/platform-common";

const appOptions: AppOptions = {
    startPageActionBarHidden: true,
};

// enableProdMode();
platformNativeScriptDynamic(appOptions).bootstrapModule(AppModule);
