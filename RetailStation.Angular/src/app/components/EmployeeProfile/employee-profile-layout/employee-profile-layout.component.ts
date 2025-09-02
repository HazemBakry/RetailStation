import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-profile-layout',
  templateUrl: './employee-profile-layout.component.html',
  styleUrls: ['./employee-profile-layout.component.css']
})
export class EmployeeProfileLayoutComponent implements OnInit {
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
