export interface SidenavItem {
    title: string,
    path: string
    icon?: string,
    expanded?: boolean,
    items?: SidenavItem[]
}

export interface SidenavToggle {
    screenWidth: number,
    collapsed: boolean
}