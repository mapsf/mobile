import {Injectable} from "@angular/core";
import "nativescript-localstorage"

@Injectable()
export class TokenStorageService {

    private key = 'token';

    constructor() {
    }

    get(): string {
        return localStorage.getItem(this.key)
    }

    set(value: string) {
        localStorage.setItem(this.key, value)
    }

    destroy() {
        localStorage.removeItem(this.key)
    }
}
