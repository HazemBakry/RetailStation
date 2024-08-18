
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-business-core-layout',
  templateUrl: './business-core-layout.component.html',
  styleUrls: ['./business-core-layout.component.css']
})
export class BusinessCoreLayoutComponent implements OnInit {

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

