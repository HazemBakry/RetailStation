import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-hr-employees',
  templateUrl: './hr-employees.component.html',
  styleUrls: ['./hr-employees.component.css']
})
export class HrEmployeesComponent implements OnInit {

  active = 1;

  constructor() { }

  ngOnInit(): void {
  }

  onActive(index: number) {
    if (index === 1) {
      this.active = 1;
    } else if (index === 2) {
      this.active = 2;
    } else if (index === 3) {
      this.active = 3;
    } else if (index === 4) {
      this.active = 4;
    } else if (index === 5) {
      this.active = 5;
    } else if (index === 6) {
      this.active = 6;
    }
  }
}
