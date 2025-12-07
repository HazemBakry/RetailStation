import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MerchantService } from 'src/app/components/Website/services/merchant.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { MerchantModel } from 'src/app/components/Admin/models/MerchantModel';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Auth/auth.service';
import { ChangePasswordModel } from 'src/app/components/Shared/models/ChangePasswordModel';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';

@Component({
  selector: 'app-merchant-profile',
  templateUrl: './merchant-profile.component.html',
  styleUrls: ['./merchant-profile.component.css'],
})
export class MerchantProfileComponent implements OnInit {
  merchantModel: MerchantModel = {} as MerchantModel;
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  showUpdateLoader: boolean = false;
  countriesSelectorData: GeneralSelectorModel[] = [];
  regionsSelectorData: GeneralSelectorModel[] = [];
  citiesSelectorData: GeneralSelectorModel[] = [];
  subscribersSelectorData: GeneralSelectorModel[] = [];
  paymentMethodsSelectorData: GeneralSelectorModel[] = [];
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
    private authService: AuthService,
    private sharedService: SharedService,
    private lookupService: LookupService,
    private toaster: ToastrService,) {
    this.userName = this.authService.getCurrentUser()?.userName
  }



  ngOnInit(): void {
    this.buildForm();
    this.getLoggedMerchantDetails();
    this.loadSelectors();
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
  loadSelectors() {
    this.sharedService.GetCountriesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.countriesSelectorData = data;
    });
    this.sharedService.GetMerchantsSelector().subscribe((data: GeneralSelectorModel[]) => {
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

  updateMerchantData() {
    if (!this.validateForm()) {
      return;
    }
    //this.merchantModel = this.formGroup.value;

    this.formData = new FormData();
    if (this.imageFile != null) {
      this.formData.append('image', this.imageFile);
    }

    // Object.keys(this.merchantModel).forEach(key => {
    //   if (key != 'image' && this.merchantModel[key])
    //     this.formData.append(key, this.merchantModel[key]);
    // });
    Object.keys(this.formGroup.value).forEach(key => {
      if (key != 'image' && this.formGroup.value[key])
        this.formData.set(key, this.formGroup.value[key]);
    });
    this.showUpdateLoader = true;
    this.merchantService.EditMerchant(this.formData).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.toaster.success(data.message);
        this.getLoggedMerchantDetails();
        this.formGroup?.reset();
        this.imageFile = null;
      } else {
        this.toaster.error(data.message);
      }
      this.showUpdateLoader = false;
    }, (err) => {
      this.showUpdateLoader = false;
    }, () => {
      this.showUpdateLoader = false;
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
      email: [null, [CustomValidators.regexPattern(RegexType.email)]],
      image: [null],
      isActive: [null],
      description: [null],
      phone: [null, [CustomValidators.regexPattern(RegexType.phoneNumber)]],
      mobile: [null, [CustomValidators.regexPattern(RegexType.phoneNumber)]],
      countryId: [null],
      cityId: [null],
      regionId: [null],
      address: [null, [CustomValidators.regexPattern(RegexType.addressLine)]],
      notes: [null],
      commercialRegister: [null, [CustomValidators.regexPattern(RegexType.numeric)]],
      deliveryCost: [null, [CustomValidators.regexPattern(RegexType.numeric)]],
      rate: [null],
      deliveryTime: [null, [CustomValidators.regexPattern(RegexType.numeric)]],
      paymentMethodId: [null],
      taxNumber: [null, [CustomValidators.regexPattern(RegexType.numeric)]],
      bankAccountNumber: [null, [CustomValidators.regexPattern(RegexType.numeric)]],
      brandName: [null],
      contactPerson: [null],
      contactMobile: [null, [CustomValidators.regexPattern(RegexType.phoneNumber)]]
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



  //-------------------------- change password ----------------------------------------------------------
  userName: string = '';
  password: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  changePassword() {
    this.userName = this.userName.trim();
    this.password = this.password.trim();
    this.newPassword = this.newPassword.trim();
    this.confirmPassword = this.confirmPassword.trim();
    if (this.password == '' || this.confirmPassword == '') {
      this.toaster.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    if (this.confirmPassword != this.newPassword) {
      this.toaster.error('كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقين');
      return;
    }
    if (this.userName == '') {
      this.toaster.error('يرجى إدخال اسم المستخدم');
      return;
    }
    let model: ChangePasswordModel = {
      username: this.userName,
      //email: this.userModel.email,
      oldPassword: this.password,
      newPassword: this.confirmPassword,
      confirmNewPassword: this.confirmPassword
    }
    this.showAddLoader = true;

    this.authService.changePassword(model).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
        this.authService.logout();

      } else {
        this.toaster.error(data.message);
      }
      this.showAddLoader = false;
    }, (err) => {
      this.showAddLoader = false;
    }, () => {
      this.showAddLoader = false;
    })
  }
}
