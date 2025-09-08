import { Component, OnInit } from '@angular/core';
import { MenuSidebarItem } from '../../Shared/models/MenuSidebarItem';
import { MenuService, MenuType } from '../../Shared/services/menu.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {

  isToggle = false;
  menuItem: MenuSidebarItem;
  constructor(private menuService: MenuService,) {
    this.menuItem = this.menuService.getMenuById(MenuType.Admin);
  }

  ngOnInit(): void {

  }

  onToggleContent() {
    this.isToggle = !this.isToggle;
    const htmlElement = document.querySelector('html');
    if (this.isToggle) {
      htmlElement.style.cssText = `overflow: hidden`;
    } else {
      htmlElement.style.cssText = `overflow: auto`;
    }
  }

  onOverlayClicked() {
    this.isToggle = false;
    const htmlElement = document.querySelector('html');
    htmlElement.style.cssText = `overflow: auto`;
  }

  //old

  toggler = false;

  onToggler() {
    this.toggler = !this.toggler;
  }
  toggleMenu(menu: HTMLElement) {
    menu.classList.toggle('show');
  }

}
