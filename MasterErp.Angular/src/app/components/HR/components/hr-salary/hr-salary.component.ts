import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HrService } from '../../services/hr.service';

@Component({
  selector: 'app-hr-salary',
  templateUrl: './hr-salary.component.html',
  styleUrls: ['./hr-salary.component.css']
})
export class HrSalaryComponent implements OnInit {
  EmployeeSalaryData: any[] = [];
  EmployeeData: any[] = [];
  form: FormGroup;
  PenaltyId: number;
  constructor(private modalService: NgbModal, private hrService: HrService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.FormInit();
    this.GetAllEmployeeSalary();
  }

  FormInit() {
    this.form = this.fb.group({
      employeeSalaryId: null,
      basicSalary: null,
      extraSalary: null,
      transport: null,
      home: null,
      mopile: null,
      food: null,
      workNature: null,
      other: null,
      totalSalary: null,
    });
  }

  FillEditForm(item: any) {
    let Item = item.salary;
    this.form.setValue({
      employeeSalaryId: Item.employeeSalaryId,
      basicSalary: Item.basicSalary,
      extraSalary: Item.extraSalary,
      transport: Item.transport,
      home: Item.home,
      mopile: Item.mopile,
      food: Item.food,
      workNature: Item.workNature,
      other: Item.other,
      totalSalary: Item.totalSalary,
    });
  }

  openEditModal(content: any, item: any) {
    this.form.reset();
    this.FillEditForm(item);
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  GetAllEmployeeSalary() {
    this.hrService.GetAllEmployeeSalary().subscribe(data => {
      this.EmployeeSalaryData = data;
      console.log(this.EmployeeSalaryData);
    });
  }

  EditEmployeeSalary() {
    this.hrService.EditEmployeeSalary(this.form.value).subscribe(data => {
      this.GetAllEmployeeSalary();
      this.form.reset();
    });
  }
}
