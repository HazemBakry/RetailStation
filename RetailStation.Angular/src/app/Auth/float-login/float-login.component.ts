import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/components/Shared/services/cart.service';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { MenuService } from 'src/app/components/Shared/services/menu.service';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';
import { LoginUserModel, MerchantRegistrationModel } from 'src/app/components/Shared/models/LoginResponseModel';
import { SubscriberType } from 'src/app/components/Shared/Enums/SubscriptionTypeEnum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';

@Component({
  selector: 'app-float-login',
  templateUrl: './float-login.component.html',
  styleUrls: ['./float-login.component.css']
})
export class FloatLoginComponent implements OnInit {
  loggingMode = true;
  email: string = '';
  userName: string = '';
  password: string = '';
  lang = 'en';
  type = '';
  returnUrl: string = '';
  appId: string = '';
  logout: boolean = false;
  showLoader: boolean = false;
  isLoginMode = true;
  subscriberModel: MerchantRegistrationModel = {} as MerchantRegistrationModel;
  subscriberImageFile: File;
  formData: FormData = new FormData();
  public formGroup: FormGroup;
  systemURL: string = environment.systemUrl;
  public SubscriberType = SubscriberType;
  constructor(private authService: AuthService,
    private router: Router,
    private toaster: ToastrService,
    private modalService: NgbModal,
    private form: FormBuilder,

    private _FormService: FormService,) { }

  ngOnInit(): void {
  }
  openLoginRegisterModal(content: TemplateRef<any>) {
    this.isLoginMode = true;

    this.buildForm();
    this.modalService.open(content, {
      size: 'md',
      centered: true,
      scrollable: true,
    });
  }

  login() {
    if (!this.userName || !this.password) {
      this.toaster.warning('Please enter a valid username and password!');
      return;
    }
    let model = {
      Email: this.email,
      userName: this.userName,
      Password: this.password
    }
    this.showLoader = true;
    this.authService.login(model).subscribe((data: LoginUserModel) => {
      if (this.authService.isAuthenticated()) {
        localStorage.setItem('lang', 'en');

        // this.redirectToDesiredApp();
        setTimeout(() => {
          window.location.reload();
        }, 50);
      } else {
        this.toaster.error(data.message);
      }
      this.showLoader = false;
    }, (error) => {
      this.showLoader = false;

    }, () => {
      this.showLoader = false;
    });
  }


  buildForm() {
    this.formGroup = this.form.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      userName: [null, Validators.required],
      password: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      phoneNumber: [null, Validators.required],
      subscriberTypeId: [SubscriberType.Customer, Validators.required],
      address: [null],
      subscriberName: [null, []],
      subscriberEmail: [null, [Validators.email]],
      // number: [null, [CustomValidators.regexPattern(RegexType.number)]],
    },
      {
        validators: [
          // CustomValidators.endDateGreaterThanStartDate('sd', 'ds', 'message'),
        ],
      });


    this.formGroup.get('subscriberTypeId').valueChanges.subscribe((subscriberTypeId) => {
      if (subscriberTypeId == SubscriberType.Supplier) {
        this._FormService.updateFieldsRequiredValidation(this.formGroup, 'subscriberName', true);
        this._FormService.updateFieldsRequiredValidation(this.formGroup, 'subscriberEmail', true);
        this._FormService.updateFieldsRequiredValidation(this.formGroup, 'address', true);
      } else {
        this._FormService.updateFieldsRequiredValidation(this.formGroup, 'subscriberName', false);
        this._FormService.updateFieldsRequiredValidation(this.formGroup, 'subscriberEmail', false);
        this._FormService.updateFieldsRequiredValidation(this.formGroup, 'address', false);
      }

    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
  }



  register() {
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
    this.showLoader = true;
    this.authService.register(this.subscriberModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.toaster.success(data?.message);
        // this.authService.loginRedirect();
        // setTimeout(() => {
        //   window.location.reload();
        // }, 50);
        this.userName = this.subscriberModel.userName;
        this.password = this.subscriberModel.password;
        this.isLoginMode = true;
      }
      else {
        this.toaster.error(data?.message);
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
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

}
