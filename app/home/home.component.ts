import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    message = "You have successfully authenticated. This is where you build your core application functionality.";

    constructor() {
    }

    ngOnInit(): void {
    }
}
