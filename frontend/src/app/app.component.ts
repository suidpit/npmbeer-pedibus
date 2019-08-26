import {Component} from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'frontend';
    icons = [
        {
            "name": "growing_dots",
            "path": "growing_dots.svg"
        },
        {
            "name": "growing_dots_long",
            "path": "growing_dots_long.svg"
        },
        {
            "name": "dot",
            "path": "dot.svg"
        },
        {
            "name": "start",
            "path": "start.svg"
        },
        {
            "name": "finish_green",
            "path": "finish_green.svg"
        },
        {
            "name": "add",
            "path": "add.svg"
        },
        {
            "name": "intermediate",
            "path": "intermediate.svg"
        },
        {
            "name": "intermediate_line",
            "path": "line_material/intermediate.svg"
        },
        {
            "name": "top_left",
            "path": "line_material/top_left.svg"
        },
        {
            "name": "bottom_left",
            "path": "line_material/bottom_left.svg"
        },
        {
            "name": "top_right",
            "path": "line_material/top_right.svg"
        },
        {
            "name": "bottom_right",
            "path": "line_material/bottom_right.svg"
        },
        {
            "name": "down",
            "path": "line_material/down.svg"
        },
        {
            "name": "start_line",
            "path": "line_material/start.svg"
        },
        {
            "name": "end_right",
            "path": "line_material/end_right.svg"
        },
        {
            "name": "end_left",
            "path": "line_material/end_left.svg"
        },
        {
            "name": "flag",
            "path": "line_material/flag.svg"
        }
    ];

    constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
        for (let img of this.icons) {
            this.matIconRegistry.addSvgIcon(
                img.name, this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/" + img.path)
            );
        }
    }
}
