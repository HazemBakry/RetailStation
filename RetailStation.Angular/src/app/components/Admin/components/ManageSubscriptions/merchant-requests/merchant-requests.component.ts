import { Component, OnInit, ViewChild } from '@angular/core';

import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionsService } from '../../../services/subscriptions.service';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { WorkflowStatus } from 'src/app/components/Shared/Enums/FinanceWorkflowStatus';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SubscriberType } from 'src/app/components/Shared/Enums/SubscriptionTypeEnum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { MerchantRegistrationModel } from 'src/app/components/Shared/models/LoginResponseModel';
import { environment } from 'src/environments/environment';
import { MerchantRequestModel } from '../../../models/MerchantRequestModel';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';

@Component({
  selector: 'app-merchant-requests',
  templateUrl: './merchant-requests.component.html',
  styleUrls: ['./merchant-requests.component.css']
})
export class MerchantRequestsComponent implements OnInit {
  TitleList = ['وحدة التحكم', 'طلبات الاشتراك'];
  public wfStatus = WorkflowStatus;
  public SubscriberType = SubscriberType;
  filterList: FilterItem[] = [];

  mainFilter: FilterItem = { categoryName: 'DueStatus', itemFlag: '4' }
  showAddLoader: boolean = false;
  selectedMerchantRequestId: string;
  pagedResponseModel: PagedResponseModel<MerchantRequestModel[]> = {
    currentPage: 1,
    pageSize: 25,
    searchText: '',
    results: []
  }
  showLoader: boolean = false;
  merchantRequestModel: MerchantRequestModel = {} as MerchantRequestModel;
  merchantImageFile: File;
  formData: FormData = new FormData();
  constructor(private subscriptionsService: SubscriptionsService,
    private form: FormBuilder, private _FormService: FormService, private offcanvasService: NgbOffcanvas, private modalService: NgbModal,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.GetAllMerchantRequests();
  }

  GetAllMerchantRequests() {
    this.showLoader = true;

    this.subscriptionsService.GetMerchantRequests_Data(this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;


      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }


  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.GetAllMerchantRequests();
  }

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.pagedResponseModel.filterList.push(this.mainFilter);
    this.GetAllMerchantRequests();
  }


  openDeleteModal(content: any, selectedMerchantRequestId: string) {
    this.selectedMerchantRequestId = selectedMerchantRequestId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  deleteMerchantRequest() {
    this.showAddLoader = true;
    this.subscriptionsService.DeleteMerchantRequest(this.selectedMerchantRequestId).subscribe(data => {

      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.GetAllMerchantRequests();
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


  ////////////////////////////  Actions /////////////////////////////


  isUpdate: boolean = false;
  public formGroup: FormGroup;
  openAddModal(content: any, merchantRequestModel: MerchantRequestModel = null) {
    this.isUpdate = false;
    this.selectedMerchantRequestId = merchantRequestModel.merchantRequestId;
    this.buildForm();
    if (merchantRequestModel)
      this.fillEditForm(merchantRequestModel);

    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });
  }
  buildForm() {
    this.formGroup = this.form.group({
      merchantRequestId: [null],
      merchantId: [null],
      merchantName: [null, [Validators.required]],
      email: [null, [Validators.required, CustomValidators.regexPattern(RegexType.email)]],
      phoneNumber: [null, [Validators.required, CustomValidators.regexPattern(RegexType.number)]],
      // merchantTypeId: [SubscriberType.Supplier, [Validators.required]],
      userName: [null, [Validators.required]],
      password: [environment.defaultUserPassword, Validators.required],

      brandName: [null, [Validators.required]],
      commercialRegister: [null],
      taxNumber: [null],
      bankAccountNumber: [null],
      address: [null],
    },
      {
        validators: [
          // CustomValidators.endDateGreaterThanStartDate('sd', 'ds', 'message'),
        ],
      });

    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
  }
  fillEditForm(merchantRequestModel: MerchantRequestModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      merchantRequestId: merchantRequestModel.merchantRequestId,
      merchantName: merchantRequestModel.merchantName,
      merchantId: merchantRequestModel.merchantId,
      email: merchantRequestModel.email,
      phoneNumber: merchantRequestModel.phoneNumber,
      merchantTypeId: merchantRequestModel.merchantTypeId,
      isApproved: merchantRequestModel.isApproved,
      commercialRegister: merchantRequestModel.commercialRegister,
      userName: merchantRequestModel.userName,
      taxNumber: merchantRequestModel.taxNumber,
      bankAccountNumber: merchantRequestModel.bankAccountNumber,
      address: merchantRequestModel.address,
      brandName: merchantRequestModel.brandName,
    });
  }
  saveRecord() {
    if (!this.validateForm()) {
      return;
    }
    this.merchantRequestModel = this.formGroup.value;

    this.formData = new FormData();
    if (this.merchantImageFile != null) {
      this.formData.append('imageFile', this.merchantImageFile);
    }


    Object.keys(this.formGroup.value).forEach(key => {
      if (key != 'imageFile' && this.formGroup.value[key])
        this.formData.append(key, this.formGroup.value[key]);
    });

    this.register();
  }

  register() {

    this.showAddLoader = true;
    this.subscriptionsService.ApproveMerchantRequest(this.selectedMerchantRequestId, this.merchantRequestModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.modalService?.dismissAll();
        this.toaster.success(data?.message);
        this.GetAllMerchantRequests();
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
  onFileChange(event: any) {
    this.merchantImageFile = event.target.files[0];
    //this.imageFileName = event.target.files[0].name;
  }

  public formErrors = {
    firstName: '',
    lastName: '',
    userName: '',
    password: '',
    email: '',
    phoneNumber: '',
    merchantTypeId: '',
    address: '',
    merchantName: '',
    merchantEmail: '',
    merchantId: ''

  };


  openSaveModal(content: any) {

    if (!this.validateForm()) {
      return;
    }
    this.modalService.open(content, { centered: true, size: 'md' });
  }

}

