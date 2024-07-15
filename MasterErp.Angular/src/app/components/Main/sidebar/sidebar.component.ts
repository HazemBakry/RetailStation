import { Component, OnInit, Input } from '@angular/core';
import { MenuSidebarItem } from '../../Shared/models/MenuSidebarItem';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() menus :MenuSidebarItem[]= [];
  @Input() toggler = false;
  activeTitle = 0;

  constructor() { }

  ngOnInit(): void {
    for (let index = 0; index < this.menus.length; index++) {
      const element = this.menus[index];
      element.index = index;
    }
  }

  toggleMenu(menu: HTMLElement) {
    menu.classList.toggle('show');
  }
  

}
