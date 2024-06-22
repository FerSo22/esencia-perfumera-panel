import { Injectable } from '@angular/core';
import { SidenavItem } from '../interfaces/sidenav.interface';

@Injectable()
export class SidenavService {
    private _sidenav: SidenavItem[] = [
        {
            title: "Inventario",
            path: "inventario",
            icon: "fa-solid fa-box-open",
            items: [
                {
                    title: "Perfumes",
                    path: "perfumes",
                    icon: "fa-solid fa-spray-can-sparkles"
                },
                // {
                //     title: "Marcas",
                //     path: "brands",
                //     icon: "fa-solid fa-certificate"
                // }
            ]
        }
    ]

    get sidenav(): SidenavItem[] {
        return [...this._sidenav];
    }

    constructor() { }
}
