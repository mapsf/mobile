import {Injectable, NgZone} from "@angular/core";

import config from "~/config";
import {AuthTokenService} from "~/shared/auth-token.service";
import {runOnce} from "~/utils";

const WS = require("nativescript-websockets");

type Listener = {
    eventName: string;
    callback: () => void;
};

type ServerEvent = {
    event: string;
    data: any;
};

@Injectable()
export class WebSocketService {

    private socket: WebSocket;

    private timeoutId: number;

    private listeners: Array<Listener> = [];

    constructor(private zone: NgZone, private tokenStorage: AuthTokenService) {
        // this.listeners.push(<Listener>{
        //     eventName: 'connected',
        //     callback: () => {
        //
        //     },
        // });
        // this.listeners.push(<Listener>{
        //     eventName: 'disconnected',
        //     callback: () => {
        //
        //     },
        // });
        // this.listeners.push(<Listener>{
        //     eventName: 'error',
        //     callback: () => {
        //
        //     },
        // });
    }

    public connect(): Promise<void> {
        console.log('[WS] connect');
        return new Promise<void>((resolve, reject) => {

            const once = runOnce();

            this.timeoutId = setTimeout(() => once(() => alert('Что-то пошло не так, не ответа от WS')), 3000);

            this.socket = new WS(config.webSocketServer, {
                headers: {'Authorization': this.tokenStorage.get()},
            });

            // this.on('connected', function () {
            //
            // });

            this.socket.addEventListener('open', (event: Event) => {
                once(resolve);
                console.log('connected');
                // this.zone.run(() => {
                // });
            });
            this.socket.addEventListener('close', (event: CloseEvent) => {
                once(() => reject(event));
                console.log('disconnected');
                // this.zone.run(() => {
                // });
            });
            this.socket.addEventListener('error', (event: ErrorEvent) => {
                once(() => reject(event));
                console.log("The socket had an error", event.error);
            });
        });
    }

    private emit() {
    }

    private waitEvent(eventName: string, callback: (data: ServerEvent) => void) {
        this.socket.addEventListener('message', (event: MessageEvent) => {
            this.zone.run(() => {
                const data: ServerEvent = JSON.parse(event.data);
                if (data.event === eventName) {
                    callback(data);
                }
            });
        });
    }

    public close() {
        clearTimeout(this.timeoutId);
        this.socket.close();
        this.listeners.forEach(listener => {
            this.socket.removeEventListener(listener.eventName, listener.callback);
        });
    }

    // TODO describe type for callback
    public on(eventName: string, callback: (data: ServerEvent) => void) {
        this.waitEvent(eventName, callback);
    }

    public send(eventName: string, data?: any): void {
        console.log('[WS] call "send"...');
        this.socket.send(JSON.stringify({
            event: eventName,
            data: data,
        }));
    }
}
