import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { GeneralAccountSettingsService } from '../../services/general-account-settings.service';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';

@Component({
  selector: 'app-tax-calculation',
  templateUrl: './tax-calculation.component.html',
  styleUrls: ['./tax-calculation.component.css']
})
export class TaxCalculationComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'حساب الضريبة'];
  TaxCalculations: any[] = [];
  TaxTypes = [{ name: 'المبيعات', value: 'المبيعات' }, { name: 'المشتريات', value: 'المشتريات' }, { name: 'لاشيئ', value: 'لاشيئ' }];
  TaxScopes = [{ name: 'خدمات', value: 'خدمات' }, { name: 'بضائع', value: 'بضائع' }];
  TaxLookups: any[] = [{ name: 'مجموعة من الضرائب', value: 1 }, { name: 'ثابتة', value: 2 }, { name: 'نسبة', value: 3 }, { name: 'النسبة شاملة الضريبة', value: 4 }];
  formGroup: FormGroup;
  TotalCount = 0;
  TaxCalculationId: any;
  totalPages: any;
  formErrors = {
    taxCalculationName: '',
    description: '',
    taxLookupId: '',
    taxType: '',
    taxScope: '',
    amount: ''
  };
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25,
    filterItems: []
  };

  constructor(private modalService: NgbModal, private toaster: ToastrService,
    private form: FormBuilder, private _FormService: FormService, private generalAccountSettingsService: GeneralAccountSettingsService) { }

  ngOnInit(): void {
    this.buildForm();
    this.GetTaxLookups();
    this.GetTaxCalculationData();
  }

  buildForm() {
    this.formGroup = this.form.group({
      taxCalculationId: [null],
      taxCalculationName: [null, [Validators.required]],
      description: [null, [Validators.required]],
      taxLookupId: [null, [Validators.required]],
      taxType: [null, [Validators.required]],
      taxScope: [null, [Validators.required]],
      amount: [null, [Validators.required]],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  fillEditForm(item: any) {
    this.formGroup.patchValue({
      taxCalculationId: item.taxCalculationId,
      taxCalculationName: item.taxCalculationName,
      description: item.description,
      taxLookupId: item.taxLookupId,
      taxType: item.taxType,
      taxScope: item.taxScope,
      amount: item.amount,
      isActive: item.isActive
    });
  }

  openItemModal(content: any, item: any) {
    if (item)
      this.fillEditForm(item);
    this.modalService.open(content, { size: 'lg', centered: true, scrollable: true });
  }

  openDeleteItemModal(content: any, id: any) {
    this.TaxCalculationId = id;
    this.modalService.open(content, { size: 'md', centered: true, scrollable: true });
  }

  GetTaxLookups() {
    this.generalAccountSettingsService.GetTaxLookups().subscribe(data => {
      this.TaxLookups = data;
      this.TaxLookups = this.TaxLookups.map(i => { return { name: i.taxLookupName, value: i.taxLookupId } });
    });
  }

  GetTaxCalculationData() {
    this.generalAccountSettingsService.GetTaxCalculationData(this.FilterModel).subscribe(data => {
      this.TaxCalculations = data;
      this.TotalCount = data && data.length > 0 && data[0].totalCount ? data[0].totalCount : 0;
    });
  }

  pageChanged(obj: any) {
    this.FilterModel.currentPage = obj.page;
    this.GetTaxCalculationData();
  }

  ChangeTaxCalculationStatus(item: any) {
    this.generalAccountSettingsService.ChangeTaxCalculationStatus(item.taxCalculationId, item.isActive).subscribe(data => {
      if (data?.isSuccess)
        this.toaster.success(data?.message);
      else
        this.toaster.error(data?.message);
    });
  }

  AddNewTaxCalculation() {
    if (!this.validateForm())
      return;
    let formData = this.formGroup.value;

    if (!formData?.taxCalculationId) {
      formData.taxCalculationId = 0;
      this.generalAccountSettingsService.AddNewTaxCalculation(formData).subscribe(data => {
        if (data?.isSuccess) {
          this.formGroup?.reset();
          this.modalService.dismissAll();
          this.GetTaxCalculationData();
          this.toaster.success(data?.message);
        }
        else
          this.toaster.error(data?.message);
      });
    } else {
      this.generalAccountSettingsService.EditTaxCalculation(formData).subscribe(data => {
        if (data?.isSuccess) {
          this.formGroup?.reset();
          this.modalService.dismissAll();
          this.GetTaxCalculationData();
          this.toaster.success(data?.message);
        }
        else
          this.toaster.error(data?.message);
      });
    }
  }

  DeleteTaxCalculation() {
    this.generalAccountSettingsService.DeleteTaxCalculation(this.TaxCalculationId).subscribe(data => {
      if (data?.isSuccess) {
        this.toaster.success(data?.message);
        this.GetTaxCalculationData();
        this.modalService.dismissAll();
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

}
