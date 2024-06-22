import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
    selector: 'app-body',
    standalone: true,
    imports: [
        NgClass,
        RouterOutlet,
        HeaderComponent
    ],
    templateUrl: './body.component.html',
    styleUrl: './body.component.css'
})
export class BodyComponent {
    @Input() collapsed: boolean = false;
    @Input() screenWidth: number = 0;

    getBodyClass(): string {
        let styleClass = "";

        if(this.collapsed && this.screenWidth > 768) {
            styleClass = "body-trimmed";
        } else if(this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0) {
            styleClass = "body-md-screen";
        }

        return styleClass;
    }
}
