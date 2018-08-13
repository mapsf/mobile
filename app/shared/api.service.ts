import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {TokenStorageService} from "~/shared/token-storage.service";

@Injectable()
export class ApiService {

    private apiServer = "http://api.mapsf.local";

    constructor(private http: HttpClient, private tokenStorage: TokenStorageService) {
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

    private createRequestHeaders(): HttpHeaders {
        return new HttpHeaders({
            "Authorization": this.tokenStorage.get(),
            "Content-Type": "application/json",
        });
    }
}
