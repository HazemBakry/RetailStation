export class MenuSidebarItem {
    isVisible?: boolean;
    menuItemId?:number;
    parentId?:number;
    menuItem?: string;
    displayName?: string;
    description?: string;
    route?: string;
    icon?: string;
    order?: number;
    index?: number;
    subMenus?: MenuSidebarItem[] = [];
    otherFeatures?:any;
  }