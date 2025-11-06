import { Component, OnInit } from '@angular/core';
import { MenuSidebarItem } from '../../Shared/models/MenuSidebarItem';
import { MenuService, MenuType } from '../../Shared/services/menu.service';

@Component({
  selector: 'app-merchant-layout',
  templateUrl: './merchant-layout.component.html',
  styleUrls: ['./merchant-layout.component.css']
})
export class MerchantLayoutComponent implements OnInit {
  isToggle = false;
  menuItem: MenuSidebarItem;

  constructor(private menuService: MenuService,) {
    this.menuItem = this.menuService.getMenuById(MenuType.MerchantHome);

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
