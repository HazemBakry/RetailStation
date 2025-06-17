import { Component, Input, OnInit } from '@angular/core';
import { EmployeeContractModel } from '../../models/Employee/EmployeeContractModel';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-hr-mini-employee-contract-info',
  templateUrl: './hr-mini-employee-contract-info.component.html',
  styleUrls: ['./hr-mini-employee-contract-info.component.css']
})
export class HrMiniEmployeeContractInfoComponent implements OnInit {
  @Input() employeeId: number;
  employeeContractInfoModel: EmployeeContractModel;
  showLoader: boolean = false;
  constructor(
    private employeeService: EmployeeService) { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: any): void {
    if (changes && changes.employeeId) {
      this.getEmployeeContractInfo();
    }
  }
  getEmployeeContractInfo() {
    this.employeeContractInfoModel = null;
    if (!this.employeeId) {
      return;
    }
    this.showLoader = true;
    this.employeeService.GetEmployeeContractInfoById(this.employeeId).subscribe((data: EmployeeContractModel) => {
      this.employeeContractInfoModel = data;
      if (data) {
      }

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });


  }

}
