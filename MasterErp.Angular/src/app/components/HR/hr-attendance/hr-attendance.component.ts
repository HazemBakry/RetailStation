import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HrService } from '../hr.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

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
    this.FormInit();
    this.GetAttendanceData();
    this.GetAllEmployees();
  }

  FormInit() {
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

  FillEditForm(item: any) {
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
    this.FillEditForm(item);
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  openDeleteModal(content: any, attendanceId: number) {
    this.AttendanceId = attendanceId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  GetAllEmployees() {
    this.hrService.GetAllEmployees().subscribe(data => {
      this.EmployeeData = data;
      console.log(this.EmployeeData);
    });
  }

  GetAttendanceData() {
    this.hrService.GetAttendanceData().subscribe(data => {
      this.AttendanceData = data;
      console.log(this.AttendanceData);
    });
  }

  AddNewAttendance() {
    this.form.patchValue({ attendanceID: 0 });
    this.hrService.AddNewAttendance(this.form.value).subscribe(data => {
      this.GetAttendanceData();
      this.form.reset();
      this.form.patchValue({ employeeID: 0 });
    });
  }

  EditAttendance() {
    this.hrService.EditAttendance(this.form.value).subscribe(data => {
      this.GetAttendanceData();
      this.form.reset();
      this.form.patchValue({ employeeID: 0 });
    });
  }

  DeleteAttendance() {
    this.hrService.DeleteAttendance(this.AttendanceId).subscribe(data => {
      this.GetAttendanceData();
    });
  }

}
