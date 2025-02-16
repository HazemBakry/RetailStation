import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { GeneralAccountSettingsService } from '../../services/general-account-settings.service';

@Component({
  selector: 'app-payment-term',
  templateUrl: './payment-term.component.html',
  styleUrls: ['./payment-term.component.css']
})
export class PaymentTermComponent implements OnInit {
  @ViewChild('PaymentTermsSidePanel') SidePanel: HTMLElement;
  PaymentTerms: any[] = [];
  PaymentTermDetails: any[] = [];
  PaymentTermDetailsValues: any[] = [];
  Today: Date = new Date();
  TitleList = ['الحسابات العامة', 'شروط السداد'];
  TermNameValidation = false;
  TermName = '';
  PaymentTermId: any;
  PaymentTermName: any;
  formGroup: FormGroup;
  formErrors = {
    duePercentage: '',
    afterDays: '',
  };
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25
  };

  constructor(private modalService: NgbModal, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,
    private form: FormBuilder, private _FormService: FormService, private generalAccountSettingsService: GeneralAccountSettingsService) { }

  ngOnInit(): void {
    this.GetPaymentTermsData();
  }

  buildForm() {
    this.formGroup = this.form.group({
      paymentTermDetailId: [null],
      paymentTermId: [null],
      duePercentage: [null, [Validators.required]],
      afterDays: [null, [Validators.required]],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  openItemModal(content: any, item: any) {
    this.TermName = '';
    this.PaymentTermId = '';
    if (item) {
      this.PaymentTermId = item.paymentTermId;
      this.TermName = item.paymentTermName;
    }
    this.modalService.open(content, { size: 'lg', centered: true, scrollable: true });
  }

  openDeleteItemModal(content: any, id: any) {
    this.PaymentTermId = id;
    this.modalService.open(content, { size: 'md', centered: true, scrollable: true });
  }

  OpenPaymentTermsSidePanel(item: any) {
    this.formGroup?.reset();
    this.PaymentTermId = item.paymentTermId;
    this.PaymentTermName = item.paymentTermName;
    this.buildForm();
    this.GetPaymentTermDetailsById();
    this.offcanvasService.open(this.SidePanel, { position: 'end' });
  }

  GetPaymentTermsData() {
    this.generalAccountSettingsService.GetPaymentTermsData().subscribe(data => {
      this.PaymentTerms = data;
    });
  }

  GetPaymentTermDetailsById() {
    this.generalAccountSettingsService.GetPaymentTermDetailsById(this.PaymentTermId).subscribe(data => {
      this.PaymentTermDetails = data;
      // this.PaymentTermDetailsValues = [];
      // this.PaymentTermDetails.forEach(item => {
      //   this.CreatePaymentTermDetailsValue(item);
      // });
    });
  }

  ChangePaymentTermStatus(item: any) {
    this.generalAccountSettingsService.ChangePaymentTermStatus(item.isActive, item.paymentTermId).subscribe(data => {
      if (data?.isSuccess) {
        this.toaster.success(data?.message);
      }
      else
        this.toaster.error(data?.message);
    })
  }

  pageChanged(obj: any) {

  }

  onduePercentageChange(value: number) {
    if (Number(value) > 100)
      this.formGroup.patchValue({ duePercentage: 100 });
  }

  onTermNameChange() {
    if (this.TermName)
      this.TermNameValidation = false;
    else
      this.TermNameValidation = true;
  }

  AddNewPaymentTerm() {
    if (!this.TermName) {
      this.TermNameValidation = true;
      return;
    }

    let obj = {
      paymentTermId: !this.PaymentTermId ? 0 : this.PaymentTermId,
      paymentTermName: this.TermName,
      isActive: true
    }

    if (!this.PaymentTermId) {
      this.generalAccountSettingsService.AddNewPaymentTerm(obj).subscribe(data => {
        if (data?.isSuccess) {
          this.toaster.success(data?.message);
          this.modalService?.dismissAll();
          this.GetPaymentTermsData();
        }
        else
          this.toaster.error(data?.message);
      });
    } else {
      this.generalAccountSettingsService.EditPaymentTerm(obj).subscribe(data => {
        if (data?.isSuccess) {
          this.toaster.success(data?.message);
          this.modalService?.dismissAll();
          this.GetPaymentTermsData();
        }
        else
          this.toaster.error(data?.message);
      });
    }
  }

  DeletePaymentTerm() {
    this.generalAccountSettingsService.DeletePaymentTerm(this.PaymentTermId).subscribe(data => {
      if (data?.isSuccess) {
        this.toaster.success(data?.message);
        this.modalService?.dismissAll();
        this.GetPaymentTermsData();
      }
      else
        this.toaster.error(data?.message);
    });
  }

  AddNewPaymentTermDetails() {
    debugger;
    if (!this.validateForm())
      return;

    this.formGroup.patchValue({ paymentTermId: this.PaymentTermId });
    let formData = this.formGroup.value;
    if (!formData?.paymentTermDetailId) {
      formData.paymentTermDetailId = 0;
      let num = this.CheckCanAddPaymentTermDetails(formData.paymentTermDetailId);
      let duePerNum = formData.duePercentage;
      if ((num + duePerNum) > 100) {
        this.toaster.warning('لقد تخطيت النسبة المطلوبة 100 %');
        return;
      }
      this.generalAccountSettingsService.AddNewPaymentTermDetails(formData).subscribe(data => {
        if (data?.isSuccess) {
          this.formGroup?.reset();
          this.toaster.success(data?.message);
          this.GetPaymentTermDetailsById();
        }
        else
          this.toaster.error(data?.message);
      });
    } else {
      let num = this.CheckCanAddPaymentTermDetails(formData.paymentTermDetailId, true);
      let duePerNum = formData.duePercentage;
      if ((num + duePerNum) > 100) {
        this.toaster.warning('لقد تخطيت النسبة المطلوبة 100 %');
        return;
      }
      this.generalAccountSettingsService.EditPaymentTermDetails(formData).subscribe(data => {
        if (data?.isSuccess) {
          this.formGroup?.reset();
          this.toaster.success(data?.message);
          this.GetPaymentTermDetailsById();
        }
        else
          this.toaster.error(data?.message);
      });
    }
  }

  DeletePaymentTermDetails(id: any) {
    this.generalAccountSettingsService.DeletePaymentTermDetails(id).subscribe(data => {
      if (data?.isSuccess) {
        this.toaster.success(data?.message);
        this.GetPaymentTermDetailsById();
      }
      else
        this.toaster.error(data?.message);
    });
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

  EditPaymentTermDetails(item: any) {
    this.formGroup.patchValue({
      paymentTermDetailId: item.paymentTermDetailId,
      duePercentage: item.duePercentage,
      afterDays: item.afterDays,
    });
  }

  CreatePaymentTermDetailsValue(item: any) {
    let obj = {
      paymentTermDetailId: item.paymentTermDetailId,
      value: Math.round((Number(1000) * item.duePercentage) / 100),
      date: this.addDays(this.Today, item.afterDays)
    }

    this.PaymentTermDetailsValues.push(obj);
  }

  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  CheckCanAddPaymentTermDetails(termDetailsId: any, idEdit = false): number {
    let duePercent = 0;
    if (!idEdit)
      this.PaymentTermDetails.forEach(i => {
        duePercent += i.duePercentage;
      });
    else
      this.PaymentTermDetails.filter(i => i.paymentTermDetailId != termDetailsId).forEach(i => {
        duePercent += i.duePercentage;
      });

    return duePercent;
  }

}
