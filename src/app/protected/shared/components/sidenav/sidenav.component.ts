import {
    Component,
    EventEmitter,
    HostListener,
    OnInit,
    Output,
    inject
} from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { SidenavService } from '../../services/sidenav.service';
import { WINDOW } from '../../../../shared/services/ssr.service';
import { SidenavItem, SidenavToggle } from '../../interfaces/sidenav.interface';
import { SublevelMenuComponent } from '../sublevel-menu/sublevel-menu.component';
import { fadeInOut } from '../../helpers/animations';

@Component({
    selector: 'app-sidenav',
    standalone: true,
    imports: [
        NgClass,
        RouterLink,
        RouterLinkActive,
        SublevelMenuComponent
    ],
    animations: [
        fadeInOut
    ],
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit {
    private _window = inject(WINDOW);

    @Output() onToggleSidenav: EventEmitter<SidenavToggle> = new EventEmitter();
    screenWidth: number = 0;
    collapsed: boolean = false;
    sidenavItems!: SidenavItem[];
    multiple: boolean = true;

    @HostListener("window:resize", ["$event"])
    onResize(event: any) {
        this.screenWidth = this._window.innerWidth;

        if(this.screenWidth <= 768) {
            this.collapsed = false;
            this.emitSidenavChanges();
        }
    }

    constructor(private router: Router,
                private sidenavService: SidenavService) {
        this.sidenavItems = this.sidenavService.sidenav;
    }

    ngOnInit() {
        this.setScreenWidth();
    }

    toggleSidenav() {
        this.collapsed = !this.collapsed;
        this.emitSidenavChanges();
    }

    closeSidenav() {
        this.collapsed = false;
        this.emitSidenavChanges();
    }

    emitSidenavChanges() {
        this.onToggleSidenav.emit({
            screenWidth: this.screenWidth,
            collapsed: this.collapsed
        });
    }

    setScreenWidth() {
        this.screenWidth = this._window.innerWidth;
    }

    getActiveClass(item: SidenavItem): string {
        return this.router.url.includes(item.path!) ? "active" : "";
    }

    handleClick(item: SidenavItem) {
        this.shrinkItems(item);
        item.expanded = !item.expanded;
    }

    shrinkItems(item: SidenavItem) {
        if(!this.multiple) {
            for(let modelItem of this.sidenavItems) {
                if(item !== modelItem && modelItem.expanded) modelItem.expanded = false;
            }
        }
    }
}