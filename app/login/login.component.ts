import {Component, ElementRef, ViewChild} from "@angular/core";
import {Router} from "@angular/router";
import {alert, prompt} from "tns-core-modules/ui/dialogs";
import {Page} from "tns-core-modules/ui/page";

import {User} from "~/shared/user.model";
import {UserService} from "~/shared/user.service";

@Component({
    selector: "app-login",
    moduleId: module.id,
    templateUrl: "./login.component.html",
    styleUrls: ['./login.component.css']
})

export class LoginComponent {
    user: User;
    processing = false;
    @ViewChild("password") password: ElementRef;
    @ViewChild("confirmPassword") confirmPassword: ElementRef;

    constructor(private page: Page, private userService: UserService, private router: Router) {
        this.page.actionBarHidden = true;
        this.user = new User();
        this.user.login = "alexandr";
        this.user.password = "1";
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
            .then(() => {
                this.processing = false;
                this.router.navigate(["/home"]);
            })
            .catch((err) => {
                alert(err.toString());
                this.processing = false;
                this.alert("Unfortunately we could not find your account.");
            });
    }

    // forgotPassword() {
    //     prompt({
    //         title: "Forgot Password",
    //         message: "Enter the email address you used to register for APP NAME to reset your password.",
    //         inputType: "email",
    //         defaultText: "",
    //         okButtonText: "Ok",
    //         cancelButtonText: "Cancel"
    //     }).then((data) => {
    //         if (data.result) {
    //             this.userService.resetPassword(data.text.trim())
    //                 .then(() => {
    //                     this.alert("Your password was successfully reset. Please check your email for instructions on choosing a new password.");
    //                 }).catch(() => {
    //                 this.alert("Unfortunately, an error occurred resetting your password.");
    //             });
    //         }
    //     });
    // }

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
}

