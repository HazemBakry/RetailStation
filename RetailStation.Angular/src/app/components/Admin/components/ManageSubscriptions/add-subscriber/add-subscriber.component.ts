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
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { SubscriberModel } from '../../../models/Subscriber';
import { SubscriptionsService } from '../../../services/subscriptions.service';
import { SubscriberType } from 'src/app/components/Shared/Enums/SubscriptionTypeEnum';

@Component({
  selector: 'app-add-subscriber',
  templateUrl: './add-subscriber.component.html',
  styleUrls: ['./add-subscriber.component.css']
})

export class AddSubscriberComponent implements OnInit {
  @Input() subscriberId: string;

  TitleList = ['مركز التحكم', 'إنشاء مشترك'];

  subscriberModel: SubscriberModel = {} as SubscriberModel;
  isUpdate: boolean = false;

  selectorData: FormDropdownModel[] = [];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  subscriberImageFile: File;
  formData: FormData = new FormData();
  public formGroup: FormGroup;
  public subscriberType = SubscriberType;


  // private datePipe: DatePipe
  constructor(private acRoute: ActivatedRoute, private router: Router, private modalService: NgbModal, private subscriptionsService: SubscriptionsService, private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {

    this.acRoute.parent.params.subscribe((params: any) => {
      if (params.SubscriberId) {
        this.subscriberId = params.SubscriberId;
        this.getSubscriberById();
      }
    });


    this.initNewForm();
    this.loadSelectors();
  }


  getSubscriberById() {
    this.showLoader = true;
    this.subscriptionsService.getSubscriberById(this.subscriberId).subscribe((data: SubscriberModel) => {
      if (data) {
        this.subscriberModel = data;
        this.initNewForm(this.subscriberModel);
      }

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });


  }

  initNewForm(subscriberModel: SubscriberModel = null) {

    this.isUpdate = false;
    this.buildForm();
    if (subscriberModel)
      this.fillEditForm(subscriberModel);

    // this.formGroup.patchValue({subscriberId:this.selectedSubscriberId});

  }
  buildForm() {
    this.formGroup = this.form.group({
      subscriberId: [null],
      subscriberName: [null, [Validators.required]],
      email: [null, [Validators.required, CustomValidators.regexPattern(RegexType.email)]],
      parentId: [null],
      subscriberTypeId: [SubscriberType.Supplier, [Validators.required]],
      domainName: [null],
      startDate: [null],
      endDate: [null],
      isApproved: [true],
      isActive: [true],
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

  saveSubscriberData() {
    console.log(this.formErrors);

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
    if (this.subscriberId)
      this.editSubscriberBasicInfo();
    else
      this.addNewSubscriber();
  }

  addNewSubscriber() {

    this.showAddLoader = true;
    this.subscriptionsService.createNewSubscriber(this.formData).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.toaster.success(data?.message);
        this.navigateToAddedSubscribers(data?.id);

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

  editSubscriberBasicInfo() {

    this.showAddLoader = true;
    this.subscriptionsService.editSubscriber(this.subscriberId, this.formData).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        // this.initNewForm();
        this.toaster.success(data?.message);
        this.getSubscriberById();
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

    // this.sharedService.GetVehiclesSelector().subscribe((data: FormDropdownModel[]) => {
    //   this.vehiclesSelectorData = data;
    // });
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


  fillEditForm(subscriberModel: SubscriberModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      subscriberId: subscriberModel.subscriberId,
      subscriberName: subscriberModel.subscriberName,
      email: subscriberModel.email,
      parentId: subscriberModel.parentId,
      domainName: subscriberModel.domainName,
      subscriberTypeId: subscriberModel.subscriberTypeId,
      isActive: subscriberModel.isActive,
      isApproved: subscriberModel.isApproved,
      // birthDate:this.datePipe.transform(subscriberModel.birthDate, 'yyyy-MM-dd'),

    });
  }

  navigateToAddedSubscribers(subscriberId: string) {
    // if (subscriberId)
    //   this.router.navigate(['.'], { relativeTo: this.acRoute, queryParams: { SubscriberId: subscriberId } });
    if (subscriberId)
      this.router.navigate([`/admin/subscriber-profile/${subscriberId}`]);

  }
  onFileChange(event: any) {
    this.subscriberImageFile = event.target.files[0];
    //this.imageFileName = event.target.files[0].name;
  }

  public formErrors = {
    subscriberId: '',
    subscriberName: '',
    email: '',
    parentId: '',
    domainName: '',
    startDate: '',
    endDate: '',

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
        queryParams: { SubscriberId: id },
        queryParamsHandling: 'merge'
      });
    }
  }

}