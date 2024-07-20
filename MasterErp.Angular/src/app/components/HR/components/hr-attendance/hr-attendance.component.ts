import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HrService } from '../../services/hr.service';

@Component({
  selector: 'app-hr-attendance',
  templateUrl: './hr-attendance.component.html',
  styleUrls: ['./hr-attendance.component.css']
})
export class HrAttendanceComponent implements OnInit {
  AttendanceData: any[] = [];
  EmployeeData: any[] = [];
  form: FormGroup;
  AttendanceId: number;
  constructor(private modalService: NgbModal, private hrService: HrService, private fb: FormBuilder,
    private datepipe: DatePipe) { }

  ngOnInit(): void {
    this.formInit();
    this.getAttendanceData();
    this.getActiveEmployees();
  }

  formInit() {
    this.form = this.fb.group({
      attendanceID: null,
      employeeID: 0,
      executionDate: null,
      fromDate: null,
      toDate: null,
      requestDate: null,
      type: null,
      noOfDays: null,
      moneyAmount: null,
    });
  }

  fillEditForm(item: any) {
    this.form.setValue({
      attendanceID: item.attendanceID,
      employeeID: item.employeeId,
      executionDate: this.datepipe.transform(item.executionDate, 'yyyy-MM-dd'),
      fromDate: this.datepipe.transform(item.fromDate, 'yyyy-MM-dd'),
      toDate: this.datepipe.transform(item.toDate, 'yyyy-MM-dd'),
      requestDate: this.datepipe.transform(item.requestDate, 'yyyy-MM-dd'),
      type: item.type,
      noOfDays: item.noOfDays,
      moneyAmount: item.moneyAmount,
    });
  }

  openEditModal(content: any, item: any) {
    this.form.reset();
    this.fillEditForm(item);
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  openDeleteModal(content: any, attendanceId: number) {
    this.AttendanceId = attendanceId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  getActiveEmployees() {
    this.hrService.GetActiveEmployeesSelector().subscribe(data => {
      this.EmployeeData = data;
      console.log(this.EmployeeData);
    });
  }

  getAttendanceData() {
    this.hrService.GetAttendanceData().subscribe(data => {
      this.AttendanceData = data;
      console.log(this.AttendanceData);
    });
  }

  addNewAttendance() {
    this.form.patchValue({ attendanceID: 0 });
    this.hrService.AddNewAttendance(this.form.value).subscribe(data => {
      this.getAttendanceData();
      this.form.reset();
      this.form.patchValue({ employeeID: 0 });
    });
  }

  editAttendance() {
    this.hrService.EditAttendance(this.form.value).subscribe(data => {
      this.getAttendanceData();
      this.form.reset();
      this.form.patchValue({ employeeID: 0 });
    });
  }

  deleteAttendance() {
    this.hrService.DeleteAttendance(this.AttendanceId).subscribe(data => {
      this.getAttendanceData();
    });
  }

}
