import { Component, OnInit } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { HrService } from '../hr.service';
@Component({
  selector: 'app-hr-employees',
  templateUrl: './hr-employees.component.html',
  styleUrls: ['./hr-employees.component.css']
})
export class HrEmployeesComponent implements OnInit {
  active = 1;
  arry = [1, 2, 3, 4, 5];

  constructor(private offcanvasService: NgbOffcanvas, private hrService: HrService) { }

  ngOnInit(): void {
    this.GetIqamaIssuePlaceData();
  }

  onActive(index: number) {
    if (index === 1) {
      this.active = 1;
    } else if (index === 2) {
      this.active = 2;
    } else if (index === 3) {
      this.active = 3;
    } else
      this.active = 4;

  }

  OpenDetailsSidePanel(content: any) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  GetIqamaIssuePlaceData() {
    this.hrService.GetIqamaIssuePlaceData().subscribe(data => {

    })
  }
}
