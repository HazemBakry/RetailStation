export class MenuSidebarItem {
    isVisible: boolean;
    menuItemId:string;
    parentId:string;
    menuItem: string;
    displayName: string;
    description: string;
    route: string;
    icon: string;
    order: number;
    index: number;
    subMenus: MenuSidebarItem[] = [];
    otherFeatures:any;
  }