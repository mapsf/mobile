import {Injectable} from "@angular/core";
// import * as localStorage from 'nativescript-localstorage'; // TODO REMOVE plugin!
import {LocalStorageService} from "~/shared/local-storage.service";

@Injectable()
export class AuthTokenService {

    private key = 'token';

    constructor(private storage: LocalStorageService) {
    }

    get(): string {
        return <string>this.storage.get(this.key, '');
        // return localStorage.getItem(this.key)
    }

    set(value: string): void {
        return this.storage.set(this.key, value);
        // localStorage.setItem(this.key, value)
    }

    destroy(): void {
        this.storage.remove(this.key);
        // localStorage.removeItem(this.key)
    }

    has(): boolean {
        return this.get().length !== 0;
    }
}
