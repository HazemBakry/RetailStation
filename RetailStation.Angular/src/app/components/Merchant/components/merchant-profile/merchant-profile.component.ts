import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MerchantService } from 'src/app/components/Website/services/merchant.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { MerchantModel } from 'src/app/components/Admin/models/MerchantModel';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-merchant-profile',
  templateUrl: './merchant-profile.component.html',
  styleUrls: ['./merchant-profile.component.css'],
})
export class MerchantProfileComponent implements OnInit {
  merchantModel: MerchantModel = {} as MerchantModel;
  showLoader: boolean = false;
  regionsSelectorData: GeneralSelectorModel[] = [];
  countriesSelectorData: GeneralSelectorModel[] = [];
  subscribersSelectorData: GeneralSelectorModel[] = [];
  paymentMethodsSelectorData: GeneralSelectorModel[] = [];
  citiesSelectorData: GeneralSelectorModel[] = [];
  imageFile: File;
  formData: FormData = new FormData();
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

  constructor(private merchantService: MerchantService,
    private _FormService: FormService,
    private form: FormBuilder,
    private toaster: ToastrService,) { }



  ngOnInit(): void {
    this.buildForm();
    this.getLoggedMerchantDetails();
  }


  getLoggedMerchantDetails() {
    this.showLoader = true;
    this.merchantService.GetLoggedMerchantDetails().subscribe((data: MerchantModel) => {
      this.merchantModel = data;
      if (this.merchantModel) {
        this.fillEditForm(this.merchantModel);
      }
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }


  updateMerchantData() {
    if (!this.validateForm()) {
      return;
    }
    //this.merchantModel = this.formGroup.value;

    this.formData = new FormData();
    if (this.imageFile != null) {
      this.formData.append('image', this.imageFile);
    }

    Object.keys(this.merchantModel).forEach(key => {
      if (key != 'image' && this.merchantModel[key])
        this.formData.append(key, this.merchantModel[key]);
    });
    Object.keys(this.formGroup.value).forEach(key => {
      if (key != 'image' && this.formGroup.value[key])
        this.formData.set(key, this.formGroup.value[key]);
    });
    this.showLoader = true;
    this.merchantService.EditMerchant(this.formData).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.toaster.success(data.message);
        this.getLoggedMerchantDetails();
        this.formGroup?.reset();
        this.imageFile = null;
      } else {
        this.toaster.error(data.message);
      }
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }

  onFileChange(event: any) {
    this.imageFile = event.target.files[0];
    //this.imageFileName = event.target.files[0].name;
  }



  fillEditForm(MerchantModel: MerchantModel) {
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
      //startDate: this.datePipe.transform(user.startDate, 'yyyy-MM-dd'),
      //endDate: this.datePipe.transform(user.endDate, 'yyyy-MM-dd'),
      imageFile: null
    });
  }


  buildForm() {
    this.formGroup = this.form.group({
      merchantId: [null],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      code: [null],
      email: [null],
      image: [null],
      isActive: [null],
      description: [null],
      phone: [null],
      mobile: [null],
      countryId: [null],
      cityId: [null],
      regionId: [null],
      address: [null],
      notes: [null],
      commercialRegister: [null],
      deliveryCost: [null],
      rate: [null],
      deliveryTime: [null],
      paymentMethodId: [null],
      taxNumber: [null],
      bankAccountNumber: [null],
      brandName: [null],
      contactPerson: [null],
      contactMobile: [null]
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
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
