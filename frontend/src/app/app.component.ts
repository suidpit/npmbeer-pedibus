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
