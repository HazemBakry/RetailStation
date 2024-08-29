import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierModel } from '../../models/SupplierModel';
import { ActionsResponseModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';
import { BalanceType } from '../../enums/Suppliers';
import { PurchaseService } from '../../services/purchase.service';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';



@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.css']
})
export class AddSupplierComponent implements OnInit {
  @Input() supplierId: number;
  supplierModel: SupplierModel = {} as SupplierModel;
  isUpdate: boolean = false;

  countriesSelectorData: FormDropdownModel[] = [];
  citiesSelectorData: FormDropdownModel[] = [];
  regionsSelectorData: FormDropdownModel[] = [];
  supplierGroupsSelectorData: FormDropdownModel[] = [];
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  supplierImageFile: File;
  formData: FormData = new FormData();
  public formGroup: FormGroup;
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25
  };

  balanceTypesSelectorData: FormDropdownModel[] = [
    { value: BalanceType.Debit, name: BalanceType[BalanceType.Debit] },
    { value: BalanceType.Credit, name: BalanceType[BalanceType.Credit] }
  ];

  constructor(private acRoute: ActivatedRoute, private router: Router, private modalService: NgbModal,
    private sharedService: SharedService,
    private purchaseService: PurchaseService,
    private form: FormBuilder,
    private _FormService: FormService,
    private datePipe: DatePipe,
    private toaster: ToastrService,
    private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.SupplierId) {
        this.supplierId = params.SupplierId;
        this.getSupplierById();
      }
    })
    this.initNewForm();
    this.loadSelectors();
  }

  getSupplierById() {
    this.showLoader = true;
    this.purchaseService.GetSupplierDetailsById(this.supplierId, this.FilterModel).subscribe((data: SupplierModel) => {
      if (data) {
        this.supplierModel = data;
        this.initNewForm(this.supplierModel);
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  initNewForm(supplierModel: SupplierModel = null) {
    this.isUpdate = false;
    this.buildForm();
    if (supplierModel)
      this.fillEditForm(supplierModel);
  }

  buildForm() {
    this.formGroup = this.form.group({
      supplierId: [null],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      phone: [null],
      mobile: [null],
      countryId: [null],
      cityId: [null],
      regionId: [null],
      address: [null],
      commercialRegister: [null],
      taxNumber: [null],
      beginningBalance: [null, [Validators.required, CustomValidators.regexPattern(RegexType.number)]],
      balanceType: [null, [Validators.required]],
      supplierGroupId: [null, [Validators.required]],
      contactPerson: [null],
      contactMobile: [null],
      notes: [null],
      isActive: [true]
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
  }

  // toggleDetails(Model: SupplierModel = null) {
  //   this.loanResponse.results = [];
  //   this.detailsView = !this.detailsView;
  //   if (this.detailsView)
  //     this.getLoans();

  //   this.initNewLoanForm(loanModel);
  // }

  saveSupplier() {
    if (!this.validateForm()) {
      return;
    }
    this.supplierModel = this.formGroup.value;

    if (this.supplierId)
      this.editSupplier();
    else
      this.addNewSupplier();
  }

  addNewSupplier() {
    this.showAddLoader = true;
    this.purchaseService.AddNewSupplier(this.supplierModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
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

  editSupplier() {
    this.showAddLoader = true;
    this.purchaseService.EditSupplier(this.supplierId, this.supplierModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        // this.initNewForm();
        this.toaster.success(data?.message);
        this.getSupplierById();
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

  loadSelectors() {
    this.sharedService.GetCountriesSelector().subscribe((data: FormDropdownModel[]) => {
      this.countriesSelectorData = data;
    });
    this.sharedService.GetCitiesSelector().subscribe((data: FormDropdownModel[]) => {
      this.citiesSelectorData = data;
    });
    this.sharedService.GetRegionsSelector().subscribe((data: FormDropdownModel[]) => {
      this.regionsSelectorData = data;
    });
    this.sharedService.GetSupplierGroupsSelector().subscribe((data: FormDropdownModel[]) => {
      this.supplierGroupsSelectorData = data;
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

  fillEditForm(supplierModel: SupplierModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      supplierId: supplierModel.supplierId,
      nameAR: supplierModel.nameAR,
      nameEN: supplierModel.nameEN,
      phone: supplierModel.phone,
      mobile: supplierModel.mobile,
      countryId: supplierModel.countryId,
      cityId: supplierModel.cityId,
      regionId: supplierModel.regionId,
      address: supplierModel.address,
      commercialRegister: supplierModel.commercialRegister,
      taxNumber: supplierModel.taxNumber,
      beginningBalance: supplierModel.beginningBalance,
      balanceType: supplierModel.balanceType,
      supplierGroupId: supplierModel.supplierGroupId,
      contactPerson: supplierModel.contactPerson,
      contactMobile: supplierModel.contactMobile,
      notes: supplierModel.notes,
      isActive: supplierModel.isActive,


    });
  }

  public formErrors = {
    supplierId: '',
    nameAR: '',
    nameEN: '',
    phone: '',
    mobile: '',
    countryId: '',
    cityId: '',
    regionId: '',
    address: '',
    commercialRegister: '',
    taxNumber: '',
    beginningBalance: '',
    balanceType: '',
    supplierGroupId: '',
    contactPerson: '',
    contactMobile: '',
    notes: '',
    isActive: ''
  };

}

