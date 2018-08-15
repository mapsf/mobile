import {Injectable} from "@angular/core";
import {User} from "./user.model";
import {ApiService} from "~/shared/api.service";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthError, AuthSuccess} from "~/common/responses/auth";

@Injectable()
export class UserService {

    constructor(private api: ApiService) {
    }

    login(user: User): Promise<AuthSuccess> {
        return new Promise((resolve, reject) => {
            this.api.login(user.login, user.password).subscribe((res: AuthSuccess) => {
                resolve(res);
            }, (err: HttpErrorResponse) => {
                this.handleErrors(err);
                reject(<AuthError>{
                    message: err.message,
                    code: err.status,
                });
            });
        });
    }

    handleErrors(error: HttpErrorResponse) {
        console.error(error);
    }
}
