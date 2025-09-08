import { Component, OnInit } from '@angular/core';
import { MenuSidebarItem } from '../../models/MenuSidebarItem';
import { MenuService, MenuType } from '../../services/menu.service';

@Component({
  selector: 'app-retail-home',
  templateUrl: './retail-home.component.html',
  styleUrls: ['./retail-home.component.css']
})
export class RetailHomeComponent implements OnInit {
  isToggle = false;
  menuItem: MenuSidebarItem;
  constructor(private menuService: MenuService,) {
    this.menuItem = this.menuService.getMenuById(MenuType.GeneralAccountsHome);
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
