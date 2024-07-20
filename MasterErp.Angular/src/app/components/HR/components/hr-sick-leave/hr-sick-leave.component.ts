import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HrService } from '../../services/hr.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-hr-sick-leave',
  templateUrl: './hr-sick-leave.component.html',
  styleUrls: ['./hr-sick-leave.component.css']
})
export class HrSickLeaveComponent implements OnInit {
  SickLeaveData: any[] = [];
  EmployeeData: any[] = [];
  form: FormGroup;
  SickLeaveId: number;
  constructor(private modalService: NgbModal, private hrService: HrService, private fb: FormBuilder,
    private datepipe: DatePipe) { }

  ngOnInit(): void {
    this.formInit();
    this.getSickLeaveData();
    this.getActiveEmployees();
  }

  formInit() {
    this.form = this.fb.group({
      sickLeaveId: null,
      employeeID: 0,
      requestDate: null,
      executionDate: null,
      noDays: null,
      moneyAmount: null,
    });
  }

  fillEditForm(item: any) {
    this.form.setValue({
      sickLeaveId: item.sickLeaveId,
      employeeID: item.employeeId,
      executionDate: this.datepipe.transform(item.executionDate, 'yyyy-MM-dd'),
      requestDate: this.datepipe.transform(item.requestDate, 'yyyy-MM-dd'),
      noDays: item.noDays,
      moneyAmount: item.moneyAmount,
    });
  }

  openEditModal(content: any, item: any) {
    this.form.reset();
    this.fillEditForm(item);
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  openDeleteModal(content: any, sickLeaveId: number) {
    this.SickLeaveId = sickLeaveId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  getActiveEmployees() {
    this.hrService.GetActiveEmployeesSelector().subscribe(data => {
      this.EmployeeData = data;
    });
  }

  getSickLeaveData() {
    this.hrService.GetSickLeaveData().subscribe(data => {
      this.SickLeaveData = data;
    });
  }

  addNewSickLeave() {
    this.form.patchValue({ sickLeaveId: 0 });
    this.hrService.AddNewSickLeave(this.form.value).subscribe(data => {
      this.getSickLeaveData();
      this.form.reset();
      this.form.patchValue({ employeeID: 0 });
    });
  }

  editSickLeave() {
    this.hrService.EditSickLeave(this.form.value).subscribe(data => {
      this.getSickLeaveData();
      this.form.reset();
      this.form.patchValue({ employeeID: 0 });
    });
  }

  deleteSickLeave() {
    this.hrService.DeleteSickLeave(this.SickLeaveId).subscribe(data => {
      this.getSickLeaveData();
    });
  }
}
