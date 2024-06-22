import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

import { SidenavService } from '../shared/services/sidenav.service';
import { SidenavComponent } from '../shared/components/sidenav/sidenav.component';
import { SidenavToggle } from '../shared/interfaces/sidenav.interface';
import { BodyComponent } from '../shared/components/body/body.component';

@Component({
    selector: 'app-main',
    standalone: true,
    imports: [
        NgClass,
        RouterLink,
        RouterOutlet,
        BodyComponent,
        SidenavComponent
    ],
    providers: [
        SidenavService
    ],
    templateUrl: './main.component.html',
    styleUrl: './main.component.css'
})
export class MainComponent {
    isSidenavCollapsed: boolean = false;
    screenWidth: number = 0;

    onToggleSidenav(sidenavData: SidenavToggle) {
        this.screenWidth = sidenavData.screenWidth;
        this.isSidenavCollapsed = sidenavData.collapsed;
    }


}
