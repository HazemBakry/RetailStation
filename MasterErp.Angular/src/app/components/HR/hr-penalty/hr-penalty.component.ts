import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HrService } from '../hr.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-hr-penalty',
  templateUrl: './hr-penalty.component.html',
  styleUrls: ['./hr-penalty.component.css']
})
export class HrPenaltyComponent implements OnInit {
  PenaltyData: any[] = [];
  EmployeeData: any[] = [];
  form: FormGroup;
  PenaltyId: number;
  constructor(private modalService: NgbModal, private hrService: HrService, private fb: FormBuilder,
    private datepipe: DatePipe) { }

  ngOnInit(): void {
    this.FormInit();
    this.GetPenaltyData();
    this.GetAllEmployees();
  }

  FormInit() {
    this.form = this.fb.group({
      penaltyID: null,
      employeeID: 0,
      penaltyDate: null,
      executionDate: null,
      moneyAmount: null,
      deductionByDays: null,
      deductionAmount: null,
      reason: null,
    });
  }

  FillEditForm(item: any) {
    this.form.setValue({
      penaltyID: item.penaltyId,
      employeeID: item.employeeId,
      penaltyDate: this.datepipe.transform(item.penaltyDate, 'yyyy-MM-dd'),
      executionDate: this.datepipe.transform(item.executionDate, 'yyyy-MM-dd'),
      moneyAmount: item.moneyAmount,
      deductionByDays: item.deductionByDays,
      deductionAmount: item.deductionAmount,
      reason:item.reason
    });
  }

  openEditModal(content: any, item: any) {
    this.form.reset();
    this.FillEditForm(item);
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  openDeleteModal(content: any, penaltyId: number) {
    this.PenaltyId = penaltyId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  GetAllEmployees() {
    this.hrService.GetAllEmployees().subscribe(data => {
      this.EmployeeData = data;
    });
  }

  GetPenaltyData() {
    this.hrService.GetPenaltyData().subscribe(data => {
      this.PenaltyData = data;
    });
  }

  AddNewPenalty() {
    this.form.patchValue({ penaltyID: 0 });
    this.hrService.AddNewPenalty(this.form.value).subscribe(data => {
      this.GetPenaltyData();
      this.form.reset();
      this.form.patchValue({ employeeID: 0 });
    });
  }

  EditPenalty() {
    this.hrService.EditPenalty(this.form.value).subscribe(data => {
      this.GetPenaltyData();
      this.form.reset();
      this.form.patchValue({ employeeID: 0 });
    });
  }

  DeletePenalty() {
    this.hrService.DeletePenalty(this.PenaltyId).subscribe(data => {
      this.GetPenaltyData();
    });
  }
}
