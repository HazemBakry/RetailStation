import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sales-layout',
  templateUrl: './sales-layout.component.html',
  styleUrls: ['./sales-layout.component.css']
})
export class SalesLayoutComponent implements OnInit {

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
