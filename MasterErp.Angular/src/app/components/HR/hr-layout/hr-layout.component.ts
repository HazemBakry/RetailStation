import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hr-layout',
  templateUrl: './hr-layout.component.html',
  styleUrls: ['./hr-layout.component.css']
})
export class HrLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  toggler = false;

  onToggler() {
    this.toggler = !this.toggler;
  }
  toggleMenu(menu: HTMLElement) {
    menu.classList.toggle('show');
  }
}
