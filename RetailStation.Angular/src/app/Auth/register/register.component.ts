import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { LoginUserModel, MerchantRegistrationModel } from 'src/app/components/Shared/models/LoginResponseModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubscriberModel } from 'src/app/components/Admin/models/Subscriber';
import { SubscriberType } from 'src/app/components/Shared/Enums/SubscriptionTypeEnum';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { FormService } from 'src/app/components/Shared/services/form.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  loggingMode = true;
  email: string = '';
  userName: string = '';
  password: string = '';
  lang = 'en';
  type = '';
  returnUrl: string = '';
  logout: boolean = false;
  showLoader: boolean = false;
  systemURL: string = environment.systemUrl;

  subscriberModel: MerchantRegistrationModel = {} as MerchantRegistrationModel;
  subscriberImageFile: File;
  formData: FormData = new FormData();
  public formGroup: FormGroup;
  public SubscriberType = SubscriberType;

  constructor(private authService: AuthService, private acRouter: ActivatedRoute,
    private router: Router, private toaster: ToastrService,
    private form: FormBuilder, private _FormService: FormService,
    private modalService: NgbModal) {
    this.returnUrl = this.acRouter.snapshot.queryParamMap.get('returnUrl'); //|| '/';
    this.logout = this.acRouter.snapshot.queryParamMap.get('logout') === 'true';
    // if (this.logout) {
    //   this.authService.logout();
    // } else if (this.authService.isAuthenticated()) {
    //   this.redirectToDesiredApp();
    // }
  }

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') ?? 'en';

    this.buildForm();
  }
  Login() {
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

        this.redirectToDesiredApp();

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

  private redirectToDesiredApp(): void {
    // this.returnUrl=sessionStorage.getItem('returnUrl');
    // if (this.returnUrl) 
    //   this.router.navigateByUrl(this.returnUrl);
    // else 
    // this.router.navigateByUrl('/');
    //const redirectUrl = `${this.returnUrl}?access_token=${encodeURIComponent(this.authService.access_Token)}`;

    let redirectUrl = this.returnUrl;
    if (this.returnUrl && !this.returnUrl.startsWith('/')) {
      const hasParams = this.returnUrl.includes('?');
      if (hasParams) {
        // If there are existing query parameters, append the access_token with '&'
        redirectUrl = `${this.returnUrl}&access_token=${encodeURIComponent(this.authService.access_Token)}`;
      } else {
        // If there are no query parameters, append the access_token with '?'
        redirectUrl = `${this.returnUrl}?access_token=${encodeURIComponent(this.authService.access_Token)}`;
      }
    }
    else {
      redirectUrl = './'
    }

    window.location.href = redirectUrl;

  }
  private isValidAppId(appId: string): boolean {
    const validAppIds = ['e5b35f76-bdd3-4e93-8038-89668f4ff4bc', 'other-app-id'];
    return validAppIds.includes(appId);
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

  saveSubscriberData() {
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

    this.showLoader = true;
    this.authService.register(this.subscriberModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.toaster.success(data?.message);
        this.authService.loginRedirect();
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
