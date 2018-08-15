import * as appSettings from 'application-settings'
import {Injectable} from "@angular/core";
import {StorageInterface} from "~/common/interfaces/storage.interface";

interface Value {
    type: string;
    value: any;
}

@Injectable()
export class LocalStorageService implements StorageInterface {
    get(key: string, defaultValue?: any): any {

        console.log(`[LocalStorageService] call "get(${key}, ${defaultValue})"`);

        if (!appSettings.hasKey(key)) {
            console.warn(`[LocalStorageService] key "${key}" does not exist!`);
            return defaultValue;
        }

        const data: Value = JSON.parse(appSettings.getString(key));

        console.log(`[LocalStorageService] value found, type is "${data.type}"`);

        // TODO найти варинт получше
        switch (data.type) {
            case 'number':
                return Number(data.value);
            case 'boolean':
                return Boolean(data.value);
            case 'string':
                return String(data.value);
            case 'object':
                return Object(data.value);
            default:
                throw new Error(`Unhandled type "${data.type}"`);
        }
    }

    set(key: string, value: any): void {

        const data: Value = {
            type: typeof value,
            value: value,
        };

        const val: string = JSON.stringify(data);

        console.log(`[LocalStorageService] call "set(${key}, ${JSON.stringify(data.value)})"`);
        console.log(`[LocalStorageService] typeof value is "${data.type}"`);

        appSettings.setString(key, val);
    }

    remove(key: string): void {
        console.log(`[LocalStorageService] call "remove(${key})"`);
        appSettings.remove(key);
    }

    removeAll(): void {
        console.log(`[LocalStorageService] call "removeAll()"`);
        appSettings.clear();
    }
}
