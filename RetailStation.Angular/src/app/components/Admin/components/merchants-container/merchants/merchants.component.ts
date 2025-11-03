import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';
import { SalesService } from 'src/app/components/Sales/services/sales.service';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { MerchantService } from 'src/app/components/Website/services/merchant.service';
import { MerchantModel } from '../../../models/Operation/MerchantModel';

@Component({
  selector: 'app-merchants',
  templateUrl: './merchants.component.html',
  styleUrls: ['./merchants.component.css']
})
export class MerchantsComponent implements OnInit {
  TitleList = ['التشغيل', 'التجار'];
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  regionsSelectorData: GeneralSelectorModel[] = [];
  countriesSelectorData: GeneralSelectorModel[] = [];
  subscribersSelectorData: GeneralSelectorModel[] = [];
  paymentMethodsSelectorData: GeneralSelectorModel[] = [];
  citiesSelectorData: GeneralSelectorModel[] = [];
  filterList: FilterItem[] = [];
  merchantModel: MerchantModel = {} as MerchantModel;
  pagedResponseModel: PagedResponseModel<MerchantModel[]> = {
    currentPage: 1,
    pageSize: 10,
    results: [],
    filterList: [],
    searchText: ''
  }

  constructor(private merchantService: MerchantService, private toaster: ToastrService,
    private sharedService: SharedService,
    private modalService: NgbModal,
    private lookupService: LookupService,
    private form: FormBuilder,
    private _FormService: FormService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader = true;
    this.merchantService.GetMerchants_Data(this.pagedResponseModel).subscribe((data: any) => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.loadData();
  }

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.loadData();
  }

  ////////////////////////////  Actions /////////////////////////////

  isUpdate: boolean = false;
  public formGroup: FormGroup;
  public formErrors = {
    merchantId: '',
    nameAR: '',
    nameEN: '',
    isActive: '',
    code: '',
    description: '',
    phone: '',
    mobile: '',
    countryId: '',
    cityId: '',
    regionId: '',
    address: '',
    notes: '',
    commercialRegister: '',
    deliveryCost: '',
    rate: '',
    deliveryTime: '',
    paymentMethodId: '',
    taxNumber: '',
    bankAccountNumber: '',
    brandName: '',
    email: '',
    contactPerson: '',
    contactMobile: '',

  };
  selectedMerchantId: number;
  openAddModal(content: any, MerchantModel: MerchantModel = null) {
    this.loadSelectors();
    this.isUpdate = false;
    this.buildForm();
    if (MerchantModel)
      this.fillEditForm(MerchantModel);

    this.modalService.open(content, { centered: true, size: 'xl', fullscreen: 'xl' });
  }

  loadSelectors() {
    this.sharedService.GetCountriesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.countriesSelectorData = data;
    });
    this.sharedService.GetSubscribersSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.subscribersSelectorData = data;
    });
    this.lookupService.GetPaymentMethods().subscribe((data: GeneralSelectorModel[]) => {
      this.paymentMethodsSelectorData = data;
    });
  }

  loadCitiesByCountryId(countryId: number) {
    this.sharedService.GetCitiesSelector(countryId).subscribe((data: GeneralSelectorModel[]) => {
      this.citiesSelectorData = data;
    });
  }

  loadRegions(countryId = null, cityId: number = null) {

    this.sharedService.GetRegionIdSelector(countryId, cityId).subscribe((data: GeneralSelectorModel[]) => {
      this.regionsSelectorData = data;
    });
  }

  buildForm() {
    this.formGroup = this.form.group({
      merchantId: [null],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      code: [null, [Validators.required]],
      isActive: [true, [Validators.required]],
      phone: [null],
      mobile: [null],
      countryId: [null],
      cityId: [null],
      regionId: [null],
      address: [null],
      notes: [null],
      commercialRegister: [null],
      rate: [null, [CustomValidators.regexPattern(RegexType.number), Validators.min(0), Validators.max(5)]],
      deliveryCost: [null, [CustomValidators.regexPattern(RegexType.currency)]],
      deliveryTime: [null, [CustomValidators.regexPattern(RegexType.number)]],
      paymentMethodId: [null],
      taxNumber: [null],
      bankAccountNumber: [null, [CustomValidators.regexPattern(RegexType.numeric)]],
      brandName: [null],
      email: [null],
      contactPerson: [null],
      contactMobile: [null],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
    this.formGroup.get('countryId').valueChanges.subscribe(countryId => {
      this.citiesSelectorData = [];
      this.regionsSelectorData = [];
      this.formGroup.patchValue({ cityId: null, regionId: null });
      if (countryId) {
        this.loadCitiesByCountryId(countryId);
        this.loadRegions(countryId);
      }
    });
    // this.formGroup.get('cityId').valueChanges.subscribe(cityId => {
    //   this.regionsSelectorData = [];
    //   this.formGroup.patchValue({ regionId: null });

    // });
  }

  saveRecord() {
    if (!this.validateForm()) {
      return;
    }
    this.merchantModel = this.formGroup.value;
    if (this.merchantModel?.merchantId)
      this.editNewMerchant();
    else
      this.addNewMerchant();
  }

  addNewMerchant() {

    this.showAddLoader = true;
    this.merchantService.CreateNewMerchant(this.merchantModel).subscribe(data => {
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

  editNewMerchant() {
    this.showAddLoader = true;
    this.merchantService.EditMerchant(this.merchantModel.merchantId, this.merchantModel).subscribe(data => {
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

  fillEditForm(MerchantModel: MerchantModel) {
    this.isUpdate = true;
    this.formGroup.patchValue({
      merchantId: MerchantModel.merchantId,
      nameAR: MerchantModel.nameAR,
      nameEN: MerchantModel.nameEN,
      code: MerchantModel.code,
      isActive: MerchantModel.isActive,
      phone: MerchantModel.phone,
      mobile: MerchantModel.mobile,
      countryId: MerchantModel.countryId,
      cityId: MerchantModel.cityId,
      regionId: MerchantModel.regionId,
      address: MerchantModel.address,
      notes: MerchantModel.notes,
      commercialRegister: MerchantModel.commercialRegister,
      rate: MerchantModel.rate,
      deliveryCost: MerchantModel.deliveryCost,
      deliveryTime: MerchantModel.deliveryTime,
      paymentMethodId: MerchantModel.paymentMethodId,
      taxNumber: MerchantModel.taxNumber,
      bankAccountNumber: MerchantModel.bankAccountNumber,
      brandName: MerchantModel.brandName,
      email: MerchantModel.email,
      contactPerson: MerchantModel.contactPerson,
      contactMobile: MerchantModel.contactMobile,

    });
  }
  openDeleteModal(content: any, id: number) {
    this.selectedMerchantId = id;
    this.modalService.open(content, { centered: true, size: 'sm' });
  }

  deleteMerchant() {
    this.showAddLoader = true;
    this.merchantService.DeleteMerchant(this.selectedMerchantId).subscribe(data => {
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


}
