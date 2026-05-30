import {Component} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {PageEndComponent} from "./components/page-end/page-end.component";
import {PageTitleComponent} from "./components/page-title/page-title.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        TranslateModule,
        PageEndComponent,
        PageTitleComponent
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

}