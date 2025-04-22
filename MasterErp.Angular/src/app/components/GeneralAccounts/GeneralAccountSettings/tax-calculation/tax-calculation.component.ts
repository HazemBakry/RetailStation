import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { GeneralAccountSettingsService } from '../../services/general-account-settings.service';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { TaxCalculationModel } from '../../models/GeneralAccounts/TaxCalculationModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';

@Component({
  selector: 'app-tax-calculation',
  templateUrl: './tax-calculation.component.html',
  styleUrls: ['./tax-calculation.component.css']
})
export class TaxCalculationComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'حساب الضريبة'];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  pagedResponse: PagedResponseDTO<TaxCalculationModel[]> = {
    currentPage: 1,
    pageSize: 25,
    results: [],
    filterList: [],
    searchText: ''
  }
  taxCalculationModel: TaxCalculationModel =
    {} as TaxCalculationModel;
  constructor(private modalService: NgbModal, private toaster: ToastrService,
    private lookupService: LookupService,
    private form: FormBuilder, private _FormService: FormService, private generalAccountSettingsService: GeneralAccountSettingsService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader = true;
    this.generalAccountSettingsService.GetTaxCalculationsData(this.pagedResponse).subscribe((data: PagedResponseDTO<TaxCalculationModel[]>) => {
      this.pagedResponse.results = data.results;
      this.pagedResponse.totalCount = data.totalCount;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }



  pageChanged(obj: any) {
    this.pagedResponse.currentPage = obj.page;
    this.loadData();
  }


  ////////////////////////////  Actions /////////////////////////////
  isUpdate: boolean = false;
  public formGroup: FormGroup;
  formErrors = {
    nameEN: '',
    nameAR: '',
    description: '',
    taxLookupId: '',
    taxType: '',
    taxScope: '',
    amount: ''
  };
  taxLookupsSelectorData: GeneralSelectorModel[] = [];
  taxScopesSelectorData: GeneralSelectorModel[] = [
    { name: 'خدمات', value: 'خدمات' },
    { name: 'بضائع', value: 'بضائع' }
  ];
  taxTypesSelectorData: GeneralSelectorModel[] = [
    { value: 'الضريبة العامة على المبيعات', name: 'الضريبة العامة على المبيعات' },
    { value: 'الضريبة العامة على المشتريات', name: 'الضريبة العامة على المشتريات' },
    { value: 'الضريبة العامة على الدخل', name: 'الضريبة العامة على الدخل' },
    { value: 'الضريبة العامة على القيمة المضافة', name: 'الضريبة العامة على القيمة المضافة' },
    { value: 'الضريبة العامة على الأرباح الرأسمالية', name: 'الضريبة العامة على الأرباح الرأسمالية' }
  ];
  selectedTaxCalculationId: number;

  openAddModal(content: any, taxCalculationModel: TaxCalculationModel = null) {
    this.loadSelectors();
    this.isUpdate = false;
    this.buildForm();
    if (taxCalculationModel)
      this.fillEditForm(taxCalculationModel);

    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });
  }

  loadSelectors() {
    this.lookupService.GetTaxLookupsSelector().subscribe(data => {
      this.taxLookupsSelectorData = data;
    });

  }
  buildForm() {
    this.formGroup = this.form.group({
      taxCalculationId: [null],
      nameEN: [null, [Validators.required]],
      nameAR: [null, [Validators.required]],
      description: [null, [Validators.required]],
      taxLookupId: [null, [Validators.required]],
      taxType: [null, [Validators.required]],
      taxScope: [null, [Validators.required]],
      amount: [null, [Validators.required,CustomValidators.regexPattern(RegexType.number), Validators.min(0),Validators.max(100)]],
      isActive: [true, [Validators.required]],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  fillEditForm(taxCalculationModel: TaxCalculationModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      taxCalculationId: taxCalculationModel.taxCalculationId,
      nameEN: taxCalculationModel.nameEN,
      nameAR: taxCalculationModel.nameAR,
      description: taxCalculationModel.description,
      taxLookupId: taxCalculationModel.taxLookupId,
      taxType: taxCalculationModel.taxType,
      taxScope: taxCalculationModel.taxScope,
      amount: taxCalculationModel.amount,
      isActive: taxCalculationModel.isActive
    });
  }

  saveRecord() {
    if (!this.validateForm()) {
      return;
    }
    this.taxCalculationModel = this.formGroup.value;
    if (this.taxCalculationModel?.taxCalculationId)
      this.editTaxCalculation();
    else
      this.addNewTaxCalculation();
  }

  addNewTaxCalculation() {

    this.showAddLoader = true;
    this.generalAccountSettingsService
      .CreateNewTaxCalculation(this.taxCalculationModel).subscribe(data => {
        if (data?.isSuccess) {
          this.formGroup?.reset();
          this.modalService?.dismissAll();
          this.loadData();
          this.toaster.success(data?.message);
        }
        else {
          this.toaster.error(data?.message);
        }
        this.showAddLoader = false;
      }, err => {
        this.showAddLoader = false;
      }, () => {
        this.showAddLoader = false;
      });



  }

  editTaxCalculation() {


    this.showAddLoader = true;
    this.generalAccountSettingsService
      .EditTaxCalculation(this.taxCalculationModel.taxCalculationId, this.taxCalculationModel).subscribe(data => {

        if (data?.isSuccess) {
          // this.formGroup?.reset();
          this.isUpdate = false;
          this.modalService?.dismissAll();
          this.formGroup?.reset();
          this.toaster.success(data?.message);

          this.loadData();
        }
        else {
          this.toaster.error(data?.message);
        }
        this.showAddLoader = false;
      }, err => {
        this.showAddLoader = false;
      }, () => {
        this.showAddLoader = false;
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



  openDeleteModal(content: any, id: number) {
    this.selectedTaxCalculationId = id;
    this.modalService.open(content, { centered: true, size: 'sm' });
  }

  deleteTaxCalculation() {
    this.showAddLoader = true;
    this.generalAccountSettingsService.DeleteTaxCalculation(this.selectedTaxCalculationId).subscribe(data => {

      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.loadData();
        this.toaster.success(data?.message);
      }
      else {
        this.toaster.error(data?.message);
      }
      this.showAddLoader = false;
    }, err => {
      this.showAddLoader = false;
    }, () => {
      this.showAddLoader = false;
    });
  }

  changeTaxCalculationStatus(item: TaxCalculationModel) {
    this.generalAccountSettingsService.ChangeTaxCalculationStatus(item.taxCalculationId, item.isActive).subscribe(data => {
      if (data?.isSuccess)
        this.toaster.success(data?.message);
      else
        this.toaster.error(data?.message);
    });
  }

}
