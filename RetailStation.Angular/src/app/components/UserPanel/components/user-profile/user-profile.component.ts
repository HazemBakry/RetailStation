import { Component, Input, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { CompareService } from 'src/app/components/Shared/services/comapre.service';
import { environment } from 'src/environments/environment';
import { CartService } from 'src/app/components/Shared/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Auth/auth.service';
import { UserModel } from 'src/app/components/Shared/models/UserModel';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { DatePipe } from '@angular/common';
import { ChangePasswordModel } from 'src/app/components/Shared/models/ChangePasswordModel';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  isItemInCart = false;
  systemURL: string = environment.systemUrl;
  isCounterMode = false;
  userModel: UserModel;
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  formData: FormData = new FormData();
  public formGroup: FormGroup;
  imageFile: File;


  constructor(
    config: NgbCarouselConfig,
    private authService: AuthService,
    private cartService: CartService,
    private toaster: ToastrService,
    private form: FormBuilder,
    private _FormService: FormService,
    private datePipe: DatePipe
  ) {
    config.interval = 5000;
    config.wrap = true;
    config.keyboard = true;
    config.pauseOnHover = false;
  }
  ngOnInit(): void {
    this.buildForm();
    this.getUser();
  }

  getUser() {
    this.showLoader = true;
    this.authService.getUser().subscribe((data: UserModel) => {
      this.userModel = data;
      if (this.userModel) {
        this.fillEditForm(this.userModel);
      }
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }
  editUser() {
    debugger
    if (!this.validateForm()) {
      return;
    }
    //this.userModel = this.formGroup.value;

    this.formData = new FormData();
    if (this.imageFile != null) {
      this.formData.append('image', this.imageFile);
    }

    Object.keys(this.userModel).forEach(key => {
      if (key != 'image' && this.userModel[key])
        this.formData.append(key, this.userModel[key]);
    });
    Object.keys(this.formGroup.value).forEach(key => {
      if (key != 'image' && this.formGroup.value[key])
        this.formData.set(key, this.formGroup.value[key]);
    });
    this.showAddLoader = true;
    this.authService.editUser(this.formData).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.toaster.success(data.message);
        this.getUser();
        this.formGroup?.reset();
        this.imageFile = null;

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
  onFileChange(event: any) {
    this.imageFile = event.target.files[0];
    //this.imageFileName = event.target.files[0].name;
  }
  fillEditForm(user: UserModel) {
    this.formGroup.patchValue({
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      startDate: this.datePipe.transform(user.startDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(user.endDate, 'yyyy-MM-dd'),
      isActive: user.isActive,
      email: user.email,
      phoneNumber: user.phoneNumber,
      subscriberId: user.subscriberId,
      imageFile: null
    });

  }

  buildForm() {
    this.formGroup = this.form.group({
      userId: [null],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      phoneNumber: [null],
      subscriberId: [null],
      email: [null, [Validators.required, Validators.email]],
      image: [null],
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
      email: this.userModel.email,
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
