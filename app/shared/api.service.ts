import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {AuthTokenService} from "~/shared/auth-token.service";
import config from './../config'

@Injectable()
export class ApiService {

    private apiServer = config.apiServer;

    constructor(private http: HttpClient, private tokenStorage: AuthTokenService) {
    }

    public ping() {
        return this.http.request('GET', `${this.apiServer}/ping`, {
            headers: this.createRequestHeaders(),
        })
    }

    public login(login: string, password: string) {
        return this.http.request('POST', `${this.apiServer}/auth`, {
            body: {
                login: login,
                password: password,
            },
            headers: this.createRequestHeaders(),
        })
    }

    private createRequestHeaders() {

        const headers = {
            "Content-Type": "application/json",
        };

        const token = this.tokenStorage.get();
        if (token) {
            headers['Authorization'] = token;
        }

        return headers;
    }
}
