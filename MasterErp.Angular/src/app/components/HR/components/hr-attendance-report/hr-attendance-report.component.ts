import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hr-attendance-report',
  templateUrl: './hr-attendance-report.component.html',
  styleUrls: ['./hr-attendance-report.component.css']
})
export class HrAttendanceReportComponent implements OnInit {
  TitleList = ['الموارد البشرية', 'الحضور والانصراف'];
  

  constructor() { }
  ngOnInit(): void {
  }


}
