import {Injectable, NgZone} from "@angular/core";

// import * as ws from "nativescript-websockets"
import config from "~/config";
import {TokenStorageService} from "~/shared/token-storage.service";
import {runOnce} from "~/utils";

const WS = require("nativescript-websockets");

@Injectable()
export class WebSocketService {

    private socket: WebSocket;

    constructor(private zone: NgZone, private tokenStorage: TokenStorageService) {
        // this.connect();
    }

    public connect(): Promise<void> {
        console.log('[WS] connect');
        return new Promise<void>((resolve, reject) => {

            const once = runOnce();

            this.socket = new WS(config.webSocketServer, {
                // headers: {'Authorization': this.tokenStorage.get()}
            });

            this.socket.addEventListener('open', (event: Event) => {
                once(resolve);
                console.log('connected');
                this.zone.run(() => {
                });
            });
            this.socket.addEventListener('close', (event: CloseEvent) => {
                once(() => reject(event));
                console.log('disconnected');
                this.zone.run(() => {
                });
            });
            this.socket.addEventListener('error', (event: ErrorEvent) => {
                once(() => reject(event));
                console.log("The socket had an error", event.error);
            });
        });
    }

    public close() {
        this.socket.close();
    }

    // TODO describe type for callback
    public on(eventName: string, callback) {
        this.socket.addEventListener('message', (event: MessageEvent) => {
            this.zone.run(() => {
                const data = JSON.parse(event.data);
                if (data.event === eventName) {
                    callback(data);
                }
            });
        });
    }

    public send(eventName: string, data?: any): void {
        console.log('[WS] Send');
        this.socket.send(JSON.stringify({
            event: eventName,
            data: data,
        }));
    }
}
