import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';
import { OperationService } from '../../../services/operation.service';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SupplierModel } from '../../../models/Operation/SupplierModel';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.css']
})
export class SuppliersComponent implements OnInit {



  TitleList = ['التشغيل', 'الموردين'];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  regionsSelectorData: GeneralSelectorModel[] = [];
  countriesSelectorData: GeneralSelectorModel[] = [];
  citiesSelectorData: GeneralSelectorModel[] = [];
  pagedResponse: PagedResponseModel<SupplierModel[]> = {
    currentPage: 1,
    pageSize: 10,
    results: [],
    filterList: [],
    searchText: ''
  }
  supplierModel: SupplierModel = {} as SupplierModel;

  constructor(private operationService: OperationService, private toaster: ToastrService,
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
    this.operationService.GetSuppliers_Data(this.pagedResponse).subscribe((data: any) => {
      this.pagedResponse.results = data.results;
      this.pagedResponse.totalCount = data.totalCount;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }



  pageChanged(obj: any) {
    this.pagedResponse.currentPage = obj.page;
    this.loadData();
  }



  ////////////////////////////  Actions /////////////////////////////


  isUpdate: boolean = false;
  public formGroup: FormGroup;
  public formErrors = {
    supplierId: '',
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
    taxNumber: '',
    beginningBalance: '',
    balanceType: '',
    supplierGroupId: '',
    contactPerson: '',
    contactMobile: '',

  };
  selectedSupplierId: number;
  openAddModal(content: any, SupplierModel: SupplierModel = null) {
    this.loadSelectors();
    this.isUpdate = false;
    this.buildForm();
    if (SupplierModel)
      this.fillEditForm(SupplierModel);

    this.modalService.open(content, { centered: true, size: 'xl', fullscreen: 'xl' });
  }
  loadSelectors() {



    this.lookupService.GetCountriesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.countriesSelectorData = data;
    });
  }

  loadCitiesByCountryId(countryId: number) {
    this.lookupService.GetCitiesSelector(countryId).subscribe((data: GeneralSelectorModel[]) => {
      this.citiesSelectorData = data;
    });
  }
  loadRegions(countryId = null, cityId: number = null) {

    this.lookupService.GetRegionIdSelector(countryId, cityId).subscribe((data: GeneralSelectorModel[]) => {
      this.regionsSelectorData = data;
    });
  }
  buildForm() {
    this.formGroup = this.form.group({
      supplierId: [null],
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
      taxNumber: [null],
      beginningBalance: [null, [Validators.required, CustomValidators.regexPattern(RegexType.currency)]],
      balanceType: [null,[Validators.required]],
      supplierGroupId: [null],
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
    this.supplierModel = this.formGroup.value;
    if (this.supplierModel?.supplierId)
      this.editNewSupplier();
    else
      this.addNewSupplier();
  }

  addNewSupplier() {

    this.showAddLoader = true;
    this.operationService
      .CreateNewSupplier(this.supplierModel).subscribe(data => {
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

  editNewSupplier() {


    this.showAddLoader = true;
    this.operationService
      .EditSupplier(this.supplierModel.supplierId, this.supplierModel).subscribe(data => {

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

  fillEditForm(SupplierModel: SupplierModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      supplierId: SupplierModel.supplierId,
      nameAR: SupplierModel.nameAR,
      nameEN: SupplierModel.nameEN,
      code: SupplierModel.code,
      isActive: SupplierModel.isActive,
      phone: SupplierModel.phone,
      mobile: SupplierModel.mobile,
      countryId: SupplierModel.countryId,
      cityId: SupplierModel.cityId,
      regionId: SupplierModel.regionId,
      address: SupplierModel.address,
      notes: SupplierModel.notes,
      commercialRegister: SupplierModel.commercialRegister,
      taxNumber: SupplierModel.taxNumber,
      beginningBalance: SupplierModel.beginningBalance,
      balanceType: SupplierModel.balanceType,
      supplierGroupId: SupplierModel.supplierGroupId,
      contactPerson: SupplierModel.contactPerson,
      contactMobile: SupplierModel.contactMobile,
    });
  }
  openDeleteModal(content: any, id: number) {
    this.selectedSupplierId = id;
    this.modalService.open(content, { centered: true, size: 'sm' });
  }

  deleteSupplier() {
    this.showAddLoader = true;
    this.operationService.DeleteSupplier(this.selectedSupplierId).subscribe(data => {

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
