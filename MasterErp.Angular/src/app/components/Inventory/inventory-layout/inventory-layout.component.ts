import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inventory-layout',
  templateUrl: './inventory-layout.component.html',
  styleUrls: ['./inventory-layout.component.css']
})
export class InventoryLayoutComponent implements OnInit {

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
