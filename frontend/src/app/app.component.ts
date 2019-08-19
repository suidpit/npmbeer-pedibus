import { Component } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

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
      "name": "dots_left",
      "path": "dots_left.svg"
    },
    {
      "name": "dots_top_left",
      "path": "dots_top_left.svg"
    },
    {
      "name": "dots_bottom_left",
      "path": "dots_bottom_left.svg"
    },
    {
      "name": "dots_right",
      "path": "dots_right.svg"
    },
    {
      "name": "dots_top_right",
      "path": "dots_top_right.svg"
    },
    {
      "name": "dots_bottom_right",
      "path": "dots_bottom_right.svg"
    },
    {
      "name": "dots",
      "path": "dots.svg"
    },
    {
      "name": "dots_down_left",
      "path": "dots_down_left.svg"
    },
    {
      "name": "dots_down_right",
      "path": "dots_down_right.svg"
    }
  ];
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer){
    for(let img of this.icons){
      this.matIconRegistry.addSvgIcon(
        img.name, this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/"+img.path)
      );
    }
  }
}
