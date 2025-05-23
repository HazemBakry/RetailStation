import { Component, OnInit } from '@angular/core';
import { MenuService, MenuType } from '../../Shared/services/menu.service';
import { MenuSidebarItem } from '../../Shared/models/MenuSidebarItem';

@Component({
  selector: 'app-system-settings-layout',
  templateUrl: './system-settings-layout.component.html',
  styleUrls: ['./system-settings-layout.component.css']
})
export class SystemSettingsLayoutComponent implements OnInit {
  isToggle = false;
  menuItem: MenuSidebarItem;

  constructor(private menuService: MenuService) {
    this.menuItem = this.menuService.getMenuById(MenuType.AdminHome);

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

