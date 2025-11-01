import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { SubscriptionsService } from 'src/app/components/Admin/services/subscriptions.service';
import { SubscriberType } from 'src/app/components/Shared/Enums/SubscriptionTypeEnum';
import { WebsiteService } from '../../services/website.service';
import { MerchantRequestModel } from 'src/app/components/Admin/models/MerchantRequestModel';

@Component({
  selector: 'app-website-apply-merchant-request',
  templateUrl: './website-apply-merchant-request.component.html',
  styleUrls: ['./website-apply-merchant-request.component.css']
})
export class WebsiteApplyMerchantRequestComponent implements OnInit {
  merchantRequestId: string;

  merchantRequestModel: MerchantRequestModel = {} as MerchantRequestModel;
  isUpdate: boolean = false;

  selectorData: FormDropdownModel[] = [];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  merchantImageFile: File;
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
    private toaster: ToastrService,
  ) { }

  ngOnInit(): void {

    // this.acRoute.parent.params.subscribe((params: any) => {
    //   if (params.MerchantRequestId) {
    //     this.merchantRequestId = params.MerchantRequestId;
    //     this.getMerchantRequestById();
    //   }
    // });
    // this.initNewForm();
    // this.loadSelectors();
  }

  openModal(content: TemplateRef<any>) {
    this.buildForm();
    this.loadSelectors();

    this.modalService.open(content, {
      size: 'md',
      centered: true,
      scrollable: true,
    });
  }

  // getMerchantRequestById() {
  //   this.showLoader = true;
  //   this.subscriptionsService.getMerchantRequestById(this.merchantRequestId).subscribe((data: MerchantRequestModel) => {
  //     if (data) {
  //       this.merchantRequestModel = data;
  //       this.initNewForm(this.merchantRequestModel);
  //     }

  //     this.showLoader = false;
  //   }, err => {
  //     this.showLoader = false;
  //   }, () => {
  //     this.showLoader = false;
  //   });


  // }

  initNewForm(merchantRequestModel: MerchantRequestModel = null) {

    this.isUpdate = false;
    this.buildForm();
    if (merchantRequestModel)
      this.fillEditForm(merchantRequestModel);

    // this.formGroup.patchValue({merchantRequestId:this.selectedMerchantRequestId});

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

  saveMerchantRequestData() {
    if (!this.validateForm()) {
      return;
    }
    this.merchantRequestModel = this.formGroup.value;
    if (this.merchantRequestId)
      this.editMerchantRequest();
    else
      this.addNewMerchantRequest();
  }

  addNewMerchantRequest() {

    this.showAddLoader = true;
    this.websiteService.SaveNewMerchantRequest(this.merchantRequestModel).subscribe((data: ActionsResponseModel) => {
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

  editMerchantRequest() {

    this.showAddLoader = true;
    this.subscriptionsService.EditMerchantRequest(this.merchantRequestId, this.merchantRequestModel).subscribe((data: ActionsResponseModel) => {
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
      // birthDate:this.datePipe.transform(merchantRequestModel.birthDate, 'yyyy-MM-dd'),

    });
  }

  navigateToAddedMerchantRequests(merchantRequestId: string) {
    // if (merchantRequestId)
    //   this.router.navigate(['.'], { relativeTo: this.acRoute, queryParams: { MerchantRequestId: merchantRequestId } });
    if (merchantRequestId)
      this.router.navigate([`/subscribe-status/${merchantRequestId}`]);

  }
  onFileChange(event: any) {
    this.merchantImageFile = event.target.files[0];
    //this.imageFileName = event.target.files[0].name;
  }

  public formErrors = {
    merchantRequestId: '',
    merchantId: '',
    merchantName: '',
    email: '',
    phoneNumber: '',
    merchantTypeId: '',
    commercialRegister: '',
    userName: '',
    taxNumber: '',
    bankAccountNumber: '',
    address: '',
    brandName: '',

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
        queryParams: { MerchantRequestId: id },
        queryParamsHandling: 'merge'
      });
    }
  }

}