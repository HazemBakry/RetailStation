import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() toggler = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleMenu(menu: HTMLElement) {
    menu.classList.toggle('show');
  }

}
