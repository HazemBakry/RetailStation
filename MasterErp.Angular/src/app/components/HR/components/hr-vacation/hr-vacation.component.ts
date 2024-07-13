import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HrService } from '../../services/hr.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-hr-vacation',
  templateUrl: './hr-vacation.component.html',
  styleUrls: ['./hr-vacation.component.css']
})
export class HrVacationComponent implements OnInit {
  VacationData: any[] = [];
  EmployeeData: any[] = [];
  form: FormGroup;
  VacationId: number;
  constructor(private modalService: NgbModal, private hrService: HrService, private fb: FormBuilder,
    private datepipe: DatePipe) { }

  ngOnInit(): void {
    this.FormInit();
    this.GetVacationData();
    this.GetAllEmployees();
  }

  FormInit() {
    this.form = this.fb.group({
      vacationID: null,
      employeeID: 0,
      alternativeEmployee: null,
      fromDate: null,
      toDate: null,
      lastDayWork: null,
      period: null,
    });
  }

  FillEditForm(item: any) {
    this.form.setValue({
      vacationID: item.vacationId,
      employeeID: item.employeeId,
      alternativeEmployee:item.alternativeEmployee,
      fromDate: this.datepipe.transform(item.fromDate, 'yyyy-MM-dd'),
      toDate: this.datepipe.transform(item.toDate, 'yyyy-MM-dd'),
      lastDayWork: this.datepipe.transform(item.lastDayWork, 'yyyy-MM-dd'),
      period: item.period,
    });
  }

  openEditModal(content: any, item: any) {
    this.form.reset();
    this.FillEditForm(item);
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  openDeleteModal(content: any, vacationId: number) {
    this.VacationId = vacationId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  GetAllEmployees() {
    this.hrService.GetAllEmployees().subscribe(data => {
      this.EmployeeData = data;
    });
  }

  GetVacationData() {
    this.hrService.GetVacationData().subscribe(data => {
      this.VacationData = data;
    });
  }

  AddNewVacation() {
    this.form.patchValue({ vacationID: 0 });
    this.hrService.AddNewVacation(this.form.value).subscribe(data => {
      this.GetVacationData();
      this.form.reset();
      this.form.patchValue({ employeeID: 0 });
    });
  }

  EditVacation() {
    this.hrService.EditVacation(this.form.value).subscribe(data => {
      this.GetVacationData();
      this.form.reset();
      this.form.patchValue({ employeeID: 0 });
    });
  }

  DeleteVacation() {
    this.hrService.DeleteVacation(this.VacationId).subscribe(data => {
      this.GetVacationData();
    });
  }
}
