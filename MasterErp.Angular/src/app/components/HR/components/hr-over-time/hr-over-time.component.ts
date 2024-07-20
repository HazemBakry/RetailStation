import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { HrService } from '../../services/hr.service';

@Component({
  selector: 'app-hr-over-time',
  templateUrl: './hr-over-time.component.html',
  styleUrls: ['./hr-over-time.component.css']
})
export class HrOverTimeComponent implements OnInit {
  OverTimeData: any[] = [];
  EmployeeData: any[] = [];
  form: FormGroup;
  OverTimeID: number;
  constructor(private modalService: NgbModal, private hrService: HrService, private fb: FormBuilder,
    private datepipe: DatePipe) { }

  ngOnInit(): void {
    this.formInit();
    this.getOverTimeData();
    this.getAllEmployees();
  }

  formInit() {
    this.form = this.fb.group({
      overTimeID: null,
      employeeID: 0,
      executionDate: null,
      requestDate: null,
      noHours: null,
      moneyAmount: null,
    });
  }

  fillEditForm(item: any) {
    this.form.setValue({
      overTimeID: item.overTimeId,
      employeeID: item.employeeId,
      executionDate: this.datepipe.transform(item.executionDate, 'yyyy-MM-dd'),
      requestDate: this.datepipe.transform(item.requestDate, 'yyyy-MM-dd'),
      noHours: item.noHours,
      moneyAmount: item.moneyAmount,
    });
  }

  openEditModal(content: any, item: any) {
    this.form.reset();
    this.fillEditForm(item);
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  openDeleteModal(content: any, overTimeId: number) {
    this.OverTimeID = overTimeId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  getAllEmployees() {
    this.hrService.GetActiveEmployeesSelector().subscribe(data => {
      this.EmployeeData = data;
    });
  }

  getOverTimeData() {
    this.hrService.GetOverTimeData().subscribe(data => {
      this.OverTimeData = data;
    });
  }

  addNewOverTime() {
    this.form.patchValue({ overTimeID: 0 });
    this.hrService.AddNewOverTime(this.form.value).subscribe(data => {
      this.getOverTimeData();
      this.form.reset();
      this.form.patchValue({ employeeID: 0 });
    });
  }

  editOverTime() {
    this.hrService.EditOverTime(this.form.value).subscribe(data => {
      this.getOverTimeData();
      this.form.reset();
      this.form.patchValue({ employeeID: 0 });
    });
  }

  deleteOverTime() {
    this.hrService.DeleteOverTime(this.OverTimeID).subscribe(data => {
      this.getOverTimeData();
    });
  }
}
