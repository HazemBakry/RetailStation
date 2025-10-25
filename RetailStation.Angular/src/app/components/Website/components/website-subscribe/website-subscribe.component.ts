import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { SubscribeRequestModel } from 'src/app/components/Admin/models/SubscribeRequestModel';
import { SubscriptionsService } from 'src/app/components/Admin/services/subscriptions.service';
import { SubscriberType } from 'src/app/components/Shared/Enums/SubscriptionTypeEnum';
import { WebsiteService } from '../../services/website.service';

@Component({
  selector: 'app-website-subscribe',
  templateUrl: './website-subscribe.component.html',
  styleUrls: ['./website-subscribe.component.css']
})
export class WebsiteSubscribeComponent implements OnInit {
  subscribeRequestId: string;

  subscribeRequestModel: SubscribeRequestModel = {} as SubscribeRequestModel;
  isUpdate: boolean = false;

  selectorData: FormDropdownModel[] = [];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  subscriberImageFile: File;
  formData: FormData = new FormData();
  public formGroup: FormGroup;
  public SubscriberType = SubscriberType;


  // private datePipe: DatePipe
  constructor(private acRoute: ActivatedRoute, 
    private router: Router, 
    private modalService: NgbModal,
    private subscriptionsService: SubscriptionsService,
    private websiteService: WebsiteService,
    private form: FormBuilder, private _FormService: FormService,
    private toaster: ToastrService
  ) { }

  ngOnInit(): void {

    // this.acRoute.parent.params.subscribe((params: any) => {
    //   if (params.SubscribeRequestId) {
    //     this.subscribeRequestId = params.SubscribeRequestId;
    //     this.getSubscribeRequestById();
    //   }
    // });
    this.initNewForm();
    this.loadSelectors();
  }


  // getSubscribeRequestById() {
  //   this.showLoader = true;
  //   this.subscriptionsService.getSubscribeRequestById(this.subscribeRequestId).subscribe((data: SubscribeRequestModel) => {
  //     if (data) {
  //       this.subscribeRequestModel = data;
  //       this.initNewForm(this.subscribeRequestModel);
  //     }

  //     this.showLoader = false;
  //   }, err => {
  //     this.showLoader = false;
  //   }, () => {
  //     this.showLoader = false;
  //   });


  // }

  initNewForm(subscribeRequestModel: SubscribeRequestModel = null) {

    this.isUpdate = false;
    this.buildForm();
    if (subscribeRequestModel)
      this.fillEditForm(subscribeRequestModel);

    // this.formGroup.patchValue({subscribeRequestId:this.selectedSubscribeRequestId});

  }
  buildForm() {
    this.formGroup = this.form.group({
      subscribeRequestId: [null],
      subscriberId: [null],
      subscriberName: [null, [Validators.required]],
      email: [null, [Validators.required, CustomValidators.regexPattern(RegexType.email)]],
      phoneNumber: [null, [Validators.required, CustomValidators.regexPattern(RegexType.number)]],
      subscriberTypeId: [SubscriberType.Supplier, [Validators.required]],
      commercialRegister: [null],
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

  saveSubscribeRequestData() {
    if (!this.validateForm()) {
      return;
    }
    this.subscribeRequestModel = this.formGroup.value;
    if (this.subscribeRequestId)
      this.editSubscribeRequest();
    else
      this.addNewSubscribeRequest();
  }

  addNewSubscribeRequest() {

    this.showAddLoader = true;
    this.websiteService.SaveNewSubscribeRequest(this.subscribeRequestModel).subscribe((data: ActionsResponseModel) => {
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

  editSubscribeRequest() {

    this.showAddLoader = true;
    this.subscriptionsService.EditSubscribeRequest(this.subscribeRequestId, this.subscribeRequestModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        // this.initNewForm();
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
  loadSelectors() {
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


  fillEditForm(subscribeRequestModel: SubscribeRequestModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      subscribeRequestId: subscribeRequestModel.subscribeRequestId,
      subscriberName: subscribeRequestModel.subscriberName,
      subscriberId: subscribeRequestModel.subscriberId,
      email: subscribeRequestModel.email,
      phoneNumber: subscribeRequestModel.phoneNumber,
      subscriberTypeId: subscribeRequestModel.subscriberTypeId,
      isApproved: subscribeRequestModel.isApproved,
      commercialRegister: subscribeRequestModel.commercialRegister,
      // birthDate:this.datePipe.transform(subscribeRequestModel.birthDate, 'yyyy-MM-dd'),

    });
  }

  navigateToAddedSubscribeRequests(subscribeRequestId: string) {
    // if (subscribeRequestId)
    //   this.router.navigate(['.'], { relativeTo: this.acRoute, queryParams: { SubscribeRequestId: subscribeRequestId } });
    if (subscribeRequestId)
      this.router.navigate([`/subscribe-status/${subscribeRequestId}`]);

  }
  onFileChange(event: any) {
    this.subscriberImageFile = event.target.files[0];
    //this.imageFileName = event.target.files[0].name;
  }

  public formErrors = {
    subscribeRequestId: '',
    subscriberId: '',
    subscriberName: '',
    email: '',
    phoneNumber: '',
    subscriberTypeId: '',
    commercialRegister: '',

  };


  openSaveModal(content: any) {
    if (!this.validateForm()) {
      return;
    }
    this.modalService.open(content, { centered: true, size: 'md' });
  }
  goToPage(id: any) {
    if (id) {
      this.router.navigate([], {
        relativeTo: this.acRoute,
        queryParams: { SubscribeRequestId: id },
        queryParamsHandling: 'merge'
      });
    }
  }

}