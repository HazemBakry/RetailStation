import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { GeneralAccountService } from '../../services/general-account.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.css']
})
export class LoansComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'القروض'];
  LoansData: any[] = [];
  formGroup: FormGroup;
  TotalCount = 0;
  LoanId: any;
  totalPages: any;
  formErrors = {
    loanName: '',
    loanAmount: '',
    date: '',
    bnefit: '',
    duration: ''
  };
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25,
    filterItems: []
  };

  constructor(private modalService: NgbModal, private toaster: ToastrService, private generalAccountService: GeneralAccountService,
    private form: FormBuilder, private _FormService: FormService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.buildForm();
    this.GetLoansData();
  }

  buildForm() {
    this.formGroup = this.form.group({
      loanId: [null],
      loanName: [null, [Validators.required]],
      loanAmount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      bnefit: [null, [Validators.required]],
      duration: [null, [Validators.required]],
      amountDue: [null],
      monthlyInstallment: [null],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  fillEditForm(item: any) {
    this.formGroup.patchValue({
      loanId: item.loanId,
      loanName: item.loanName,
      loanAmount: item.loanAmount,
      date: this.datePipe.transform(item.date, 'yyyy-MM-dd'),
      bnefit: item.bnefit,
      duration: item.duration,
      amountDue: item.amountDue,
      monthlyInstallment: item.monthlyInstallment,
    });
  }

  openItemModal(content: any, item: any) {
    this.formGroup?.reset();
    if (item)
      this.fillEditForm(item);
    this.modalService.open(content, { size: 'lg', centered: true, scrollable: true });
  }

  openDeleteItemModal(content: any, id: any) {
    this.LoanId = id;
    this.modalService.open(content, { size: 'md', centered: true, scrollable: true });
  }

  GetLoansData() {
    this.generalAccountService.GetLoansData().subscribe(data => {
      this.LoansData = data;
      // this.TotalCount = data && data.length > 0 && data[0].totalCount ? data[0].totalCount : 0;
    });
  }

  pageChanged(obj: any) {
  }

  AddNewLoans() {
    if (!this.validateForm())
      return;

    if (!this.amountDueCalc())
      return;

    let formData = this.formGroup.value;
    if (!formData?.loanId) {
      formData.loanId = 0;
      this.generalAccountService.AddNewLoans(formData).subscribe(data => {
        if (data?.isSuccess) {
          this.modalService.dismissAll();
          this.GetLoansData();
          this.toaster.success(data?.message);
        }
        else
          this.toaster.error(data?.message);
      });
    } else {
      this.generalAccountService.EditLoans(formData).subscribe(data => {
        if (data?.isSuccess) {
          this.modalService.dismissAll();
          this.GetLoansData();
          this.toaster.success(data?.message);
        }
        else
          this.toaster.error(data?.message);
      });
    }
  }

  DeleteLoans() {
    this.generalAccountService.DeleteLoans(this.LoanId).subscribe(data => {
      if (data?.isSuccess) {
        this.toaster.success(data?.message);
        this.GetLoansData();
        this.modalService.dismissAll();
      }
      else
        this.toaster.error(data?.message);
    });
  }

  amountDueCalc(): boolean {
    let isValid = true;
    let formData = this.formGroup.value;
    if (formData?.bnefit > 100) {
      this.toaster.warning('نسبة الفائدة لا تتخطى 100 %');
      isValid = false;
      return;
    }
    let bnefitValue = 0;
    if (formData?.duration)
      if (formData?.bnefit && formData?.loanAmount) {
        bnefitValue = (formData?.bnefit / 100) * formData?.loanAmount;
        let amountDue = bnefitValue + formData?.loanAmount;
        this.formGroup.patchValue({
          amountDue: Math.round(amountDue),
          monthlyInstallment: Math.round(amountDue / formData?.duration)
        });
      }

    return isValid;
  }

  validateForm(): boolean {
    this._FormService.markFormGroupTouched(this.formGroup);
    if (this.formGroup.valid) {
      return true;
    } else {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, false)
      return false;
    }
  }
}
