import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {alert, prompt} from "tns-core-modules/ui/dialogs";
import {Page} from "tns-core-modules/ui/page";

import {User} from "~/shared/user.model";
import {UserService} from "~/shared/user.service";
import {AuthTokenService} from "~/shared/auth-token.service";
import {AuthError, AuthSuccess} from "~/common/responses/auth";

@Component({
    selector: "app-login",
    moduleId: module.id,
    templateUrl: "./login.component.html",
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

    user: User;
    processing = false;

    @ViewChild("password") password: ElementRef;
    @ViewChild("confirmPassword") confirmPassword: ElementRef;

    constructor(private page: Page, private userService: UserService, private router: Router, private authToken: AuthTokenService) {

        if (this.authToken.has()) {
            this.goHome();
        }

        this.page.actionBarHidden = true;
        this.user = new User();
        this.user.login = "alexandr";
        this.user.password = "1";
    }

    ngOnInit(): void {

    }

    submit() {
        if (!this.user.login || !this.user.password) {
            this.alert("Please provide both an email address and password.");
            return;
        }

        this.login();
    }

    login() {
        this.processing = true;
        this.userService.login(this.user)
            .then((res: AuthSuccess) => {
                this.authToken.set(res.token);
                this.processing = false;
                this.goHome();
            })
            .catch((err: AuthError) => {
                this.processing = false;
                alert(err.message);
                this.alert("Unfortunately we could not find your account.");
            });
    }

    focusPassword() {
        this.password.nativeElement.focus();
    }

    focusConfirmPassword() {
        this.confirmPassword.nativeElement.focus();
    }

    alert(message: string) {
        return alert({
            title: "APP NAME",
            okButtonText: "OK",
            message: message
        });
    }

    private goHome(): void {
        this.router.navigate(["/home"]);
    }
}
