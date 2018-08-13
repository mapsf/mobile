import {Injectable} from "@angular/core";
import {User} from "./user.model";
import {ApiService} from "~/shared/api.service";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable()
export class UserService {

    constructor(private api: ApiService) {
    }

    login(user: User): Promise<any> {
        return new Promise((resolve, reject) => {
            this.api.login(user.login, user.password).subscribe(res => {
                console.log(res);
                resolve(res);
            }, err => {
                console.log(err.stack);
                this.handleErrors(err);
                reject(err);
            });
        });
    }

    handleErrors(error: HttpErrorResponse) {
        console.error(error);
    }
}
