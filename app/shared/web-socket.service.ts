import {Injectable} from "@angular/core";

import config from "~/config";
import {AuthTokenService} from "~/shared/auth-token.service";
import {runOnce} from "~/utils";

require("nativescript-websockets");

type Listener = {
    eventName: string;
    callback: (event: any) => void;
};

type ServerMessage = {
    // название события
    event: string;
    // получаемые данные
    data: any;
}

// сообщение получаемое клиентом
type ToClientMessage = {
    originalEvent?: Event;
    // название события
    eventName: string;
    // получаемые данные
    data: any;
};

// сообщение отправляемое клиентом
type FromClientMessage = {
    // название события
    eventName: string;
    // отпавляемые данные
    data: any;
};

type Error = {};

@Injectable()
export class WebSocketService {

    private socket: WebSocket;

    private timeoutId: number;

    private listeners: Array<Listener> = [];

    constructor(private tokenStorage: AuthTokenService) {
    }

    public connect(): Promise<ToClientMessage> {

        // const once = runOnce();

        console.log('[WS] connect');
        return new Promise<ToClientMessage>((resolve, reject) => {

            // this.timeoutId = setTimeout(() => once(() => {
            //     this.emit(<ToClientMessage>{
            //         eventName: 'customError',
            //         data: new Error("Долго подключались, но не подключились....")
            //     });
            // }), 3000);

            this.socket = new WebSocket(config.webSocketServer, /*<any>{
                headers: {'Authorization': this.tokenStorage.get()},
            }*/);

            this.on('connected', (msg: ToClientMessage) => resolve(msg));
            this.on('disconnected', (msg: ToClientMessage) => reject(msg));
            this.on('error', (msg: ToClientMessage) => reject(msg));
            // this.on('customError', (msg: ToClientMessage) => reject(msg));

            this.initEvents();
        });
    }

    private emit(event: ToClientMessage) {
        this.listeners.forEach((listener: Listener) => {
            if (listener.eventName === event.eventName) {
                listener.callback(event.data);
            }
        });
    }

    public close() {
        clearTimeout(this.timeoutId);
        this.socket.close();
        this.listeners.forEach((listener: Listener) => {
            this.socket.removeEventListener(listener.eventName, listener.callback);
        });
    }

    // TODO describe type for callback
    public on(eventName: string, callback: (data: ToClientMessage) => void) {
        this.listeners.push(<Listener>{
            eventName: eventName,
            callback: callback,
        });
    }

    public send(eventName: string, data?: any): void {
        this.debug('[WS] call "send"...');
        const message: FromClientMessage = {eventName: eventName, data: data};
        this.socket.send(JSON.stringify(message));
    }

    private initEvents() {
        this.socket.onopen = (event: Event) => {
            this.debug('connected');
            this.emit(<ToClientMessage>{eventName: 'connected', data: event, originalEvent: event});
        };
        this.socket.onclose = (event: CloseEvent) => {
            this.debug('disconnected');
            this.emit(<ToClientMessage>{eventName: 'disconnected', data: event, originalEvent: event});
        };
        this.socket.onmessage = (event: MessageEvent) => {
            this.debug('message');
            const data: ServerMessage = JSON.parse(event.data);
            if (!data.event || !data.data) {
                this.debug('Сервер отправил сообщение в неправильном формате -> ', event.data);
            } else {
                this.emit(<ToClientMessage>{eventName: data.event, data: data.data, originalEvent: event});
            }
        };
        this.socket.onerror = (event: ErrorEvent) => {
            this.debug("The socket had an error", event.error);
            this.emit(<ToClientMessage>{eventName: 'error', data: event, originalEvent: event});
        };
    }

    private debug(...args: any[]) {
        console.log('[WS]', args);
    }
}
