import { Component, Input, OnInit } from '@angular/core';
import { SidenavItem } from '../../interfaces/sidenav.interface';
import { NgClass } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { fadeInOut, submenu } from '../../helpers/animations';

@Component({
    selector: 'app-sublevel-menu',
    standalone: true,
    imports: [
        NgClass,
        RouterLink,
        RouterLinkActive
    ],
    animations: [
        fadeInOut,
        submenu
    ],
    templateUrl: './sublevel-menu.component.html',
    styleUrl: '../sidenav/sidenav.component.css'
})
export class SublevelMenuComponent {
    @Input() sidenavItem: SidenavItem = {
        title: "",
        icon: "",
        path: "",
        items: []
    }
    @Input() collapsed: boolean = false;
    @Input() animating: boolean | undefined;
    @Input() expanded: boolean | undefined;
    @Input() multiple: boolean = false;

    constructor(private router: Router) { }

    handleClick(item: SidenavItem) {
        // if(this.multiple) {
        //     if(this.sidenavItem.items && this.sidenavItem.items.length > 0) {
        //         for(let modelItem of this.sidenavItem.items) {
        //             if()
        //         }
        //     }
        // }
        if(!this.multiple) return;
        if(!this.sidenavItem.items || this.sidenavItem.items.length === 0) return;

        for(let modelItem of this.sidenavItem.items) {
            if(item !== modelItem && modelItem.expanded) {
                modelItem.expanded = false;
            }
        }

        item.expanded = !item.expanded;
    }

    getIconClass(item: SidenavItem): string {
        return item.icon ? item.icon : "fa-solid fa-circle sublevel-link_icon-circle";
    }

    getActiveClass(item :SidenavItem): string {
        // console.log(item.path);
        // console.log(item.expanded);
        // console.log(this.router.url.includes(item.path))
        return /* item.expanded && */ this.router.url.includes(item.path)
                ? "active-sublevel"
                : "";
    }
}
