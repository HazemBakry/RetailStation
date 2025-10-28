import { Component, OnInit, ViewChild } from '@angular/core';

import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionsService } from '../../../services/subscriptions.service';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { WorkflowStatus } from 'src/app/components/Shared/Enums/FinanceWorkflowStatus';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SubscribeRequestModel } from '../../../models/SubscribeRequestModel';
import { SubscriberType } from 'src/app/components/Shared/Enums/SubscriptionTypeEnum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { SubscriberRegistrationModel } from 'src/app/components/Shared/models/LoginResponseModel';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-subscription-requests',
  templateUrl: './subscription-requests.component.html',
  styleUrls: ['./subscription-requests.component.css']
})
export class SubscriptionRequestsComponent implements OnInit {
  TitleList = ['وحدة التحكم', 'طلبات الاشتراك'];
  public wfStatus = WorkflowStatus;
  public SubscriberType = SubscriberType;
  filterList: FilterItem[] = [];

  mainFilter: FilterItem = { categoryName: 'DueStatus', itemFlag: '4' }
  showAddLoader: boolean = false;
  selectedSubscribeRequestId: string;
  pagedResponseModel: PagedResponseModel<SubscribeRequestModel[]> = {
    currentPage: 1,
    pageSize: 25,
    searchText: '',
    results: []
  }
  showLoader: boolean = false;
  subscriberModel: SubscriberRegistrationModel = {} as SubscriberRegistrationModel;
  subscriberImageFile: File;
  formData: FormData = new FormData();
  constructor(private subscriptionsService: SubscriptionsService,
    private form: FormBuilder, private _FormService: FormService, private offcanvasService: NgbOffcanvas, private modalService: NgbModal,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.GetAllSubscribeRequests();
  }

  GetAllSubscribeRequests() {
    this.showLoader = true;

    this.subscriptionsService.GetSubscribeRequests_Data(this.pagedResponseModel).subscribe(data => {
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
    this.GetAllSubscribeRequests();
  }

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.pagedResponseModel.filterList.push(this.mainFilter);
    this.GetAllSubscribeRequests();
  }


  openDeleteModal(content: any, selectedSubscribeRequestId: string) {
    this.selectedSubscribeRequestId = selectedSubscribeRequestId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  deleteSubscribeRequest() {
    this.showAddLoader = true;
    this.subscriptionsService.DeleteSubscribeRequest(this.selectedSubscribeRequestId).subscribe(data => {

      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.GetAllSubscribeRequests();
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
  openAddModal(content: any, subscribeRequestModel: SubscribeRequestModel = null) {
    this.isUpdate = false;
    this.selectedSubscribeRequestId = subscribeRequestModel.subscribeRequestId;
    this.buildForm();
    if (subscribeRequestModel)
      this.fillEditForm(subscribeRequestModel);

    this.modalService.open(content, { centered: true, size: 'xl', fullscreen: 'xl' });
  }
  buildForm() {
    this.formGroup = this.form.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      userName: [null, Validators.required],
      password: [environment.defaultUserPassword, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      phoneNumber: [null, Validators.required],
      subscriberTypeId: [SubscriberType.Customer, Validators.required],
      address: [null],
      subscriberName: [null, Validators.required],
      subscriberEmail: [null, [Validators.required, Validators.email]],
      // number: [null, [CustomValidators.regexPattern(RegexType.number)]],
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
  fillEditForm(subscribeRequestModel: SubscribeRequestModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      subscriberName: subscribeRequestModel.subscriberName,
      subscriberId: subscribeRequestModel.subscriberId,
      subscriberEmail: subscribeRequestModel.email,
      phoneNumber: subscribeRequestModel.phoneNumber,
      subscriberTypeId: subscribeRequestModel.subscriberTypeId
    });
  }
  saveRecord() {
    if (!this.validateForm()) {
      return;
    }
    this.subscriberModel = this.formGroup.value;

    this.formData = new FormData();
    if (this.subscriberImageFile != null) {
      this.formData.append('imageFile', this.subscriberImageFile);
    }


    Object.keys(this.formGroup.value).forEach(key => {
      if (key != 'imageFile' && this.formGroup.value[key])
        this.formData.append(key, this.formGroup.value[key]);
    });

    this.register();
  }

  register() {

    this.showAddLoader = true;
    this.subscriptionsService.ApproveSubscribeRequest(this.selectedSubscribeRequestId, this.subscriberModel).subscribe((data: ActionsResponseModel) => {
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
    this.subscriberImageFile = event.target.files[0];
    //this.imageFileName = event.target.files[0].name;
  }

  public formErrors = {
    firstName: '',
    lastName: '',
    userName: '',
    password: '',
    email: '',
    phoneNumber: '',
    subscriberTypeId: '',
    address: '',
    subscriberName: '',
    subscriberEmail: '',
    subscriberId: ''

  };


  openSaveModal(content: any) {

    if (!this.validateForm()) {
      return;
    }
    this.modalService.open(content, { centered: true, size: 'md' });
  }

}

