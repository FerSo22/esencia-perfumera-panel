import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

// import { AvatarModule } from 'primeng/avatar';
import { SharedModule } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        NgClass,
        // AvatarModule,
        SharedModule,
        ToolbarModule
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
    @Input() collapsed: boolean = false;
    @Input() screenWidth: number = 0;

    getHeaderClass(): string {
        let styleClass = "";

        if(this.collapsed && this.screenWidth > 768) {
            styleClass = "header-trimmed";
        } else if(this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0) {
            styleClass = "header-md-screen";
        }

        return styleClass;
    }
}
