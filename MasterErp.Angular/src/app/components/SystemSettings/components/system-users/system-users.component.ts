import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FilterItem, FilterModel, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { UserModel } from 'src/app/components/Shared/models/UserModel';
import { environment } from 'src/environments/environment';
import { SystemSettingsService } from '../../services/system-settings.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { AuthService } from 'src/app/Auth/auth.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { AddUserRoleModel, RoleModel } from 'src/app/components/Shared/models/RoleModel';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { HrService } from 'src/app/components/HR/services/hr.service';

@Component({
  selector: 'app-system-users',
  templateUrl: './system-users.component.html',
  styleUrls: ['./system-users.component.css']
})
export class SystemUsersComponent implements OnInit {
  TitleList = ['إعدادات النظام', 'بيانات المستتخدمين'];
  usersData: UserModel[] = [];
  UsersRoles: any[] = [];
  URLs: any[] = [];
  ImagesName: any[] = [];

  systemUrl: string = environment.systemUrl
  filterList: FilterModel[] = [];
  lang: string = 'en';

  defaultImage = `${this.systemUrl}assets/images/av-8.png`;
  pagingUsersData: any;
  searchText = '';
  form: FormGroup;
  userModel: UserModel = {} as UserModel;
  UserId: any;
  totalCount: any;
  totalPages: any;
  pageSize: any = 8;
  currentPage: any = 1;
  StartIndex = 0;
  manageRoles = false;
  BranchValidate = false;
  selectedUser: any;
  rolesList: RoleModel[] = [];
  searchFilterModel: SearchFilterModel = {
    currentPage: 1,
    pageSize: 10,
    filterModel: { filterItems: [] }
  };

  pagedResponseModel: PagedResponseDTO<UserModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''

  }
  employeesSelectorData: FormDropdownModel[] = [];
  branchSelectorData: FormDropdownModel[] = [];

  public formGroup: FormGroup;
  formData: FormData = new FormData();
  selectedFile: File;
  public formErrors = {
    userId: '',
    fullName: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    employeeId: '',
    userName: '',
    email: '',
    password: '',

  };
  showLoader: boolean = false;
  constructor(private modalService: NgbModal, private toaster: ToastrService,
    private settingsService: SystemSettingsService,
    private fb: FormBuilder, private _FormService: FormService,
    private hrService: HrService,
    private sharedService: SharedService, private authService: AuthService) { }

  ngOnInit(): void {
    this.GetUsersData();
    this.loadSelectors();
  }

  openUserPopup(content: any, user: UserModel = null) {
    this.buildForm();
    this.URLs = [];
    if (user != null)
      this.fillEditForm(user)
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  loadSelectors() {
    this.hrService.GetActiveEmployeesSelector().subscribe((data: FormDropdownModel[]) => {
      this.employeesSelectorData = data;
    });

    this.sharedService.GetBranchesSelector().subscribe((data: FormDropdownModel[]) => {
      this.branchSelectorData = data;
    });
  }

  buildForm() {
    this.formGroup = this.fb.group({
      userId: [null],
      fullName: [null, [Validators.required]],
      // lastName: [null, [Validators.required]],
      userName: [null, [Validators.required]],
      phoneNumber: [null],
      employeeId: [null],
      branchId: [null],
      email: [null, [Validators.required, Validators.email]],
      password: [environment.defaultUserPassword],
      image: [null],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });

  }

  fillEditForm(user: UserModel) {
    this.formGroup.patchValue({
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.firstName + ' ' + user.lastName,
      userName: user.userName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      employeeId: user.employeeId,
      branchId: user.branchId,
      imageFile: null
    });

  }

  saveUser() {
    if (!this.validateForm()) {
      return;
    }



    this.userModel = this.formGroup.value;
    this.formData = new FormData();
    if (this.selectedFile)
      this.formData.append('image', this.selectedFile);
    for (const key in this.formGroup.value) {
      if (this.formGroup.value[key] && key != 'image') {
        this.formData.append(key, this.formGroup.value[key]);
      }
    }

    if (this.userModel?.userId)
      this.editUser();
    else
      this.addNewUser();
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

  addNewUser() {
    this.settingsService.addNewUser(this.formData).subscribe(data => {
      if (data) {
        if (this.lang == 'en') {
          this.toaster.success("Data Saved Successfully");
        } else {
          this.toaster.success("تمت الاضافة بنجاح");
        }
        this.GetUsersData();
        this.formGroup?.reset();
        this.modalService.dismissAll();
        this.selectedFile = null;


      } else {
        if (this.lang == 'en') {
          this.toaster.error("! Error Failed To Save Data");
        } else {
          this.toaster.error("لقد حدث خطا");
        }

      }
    });
  }
  editUser() {
    this.settingsService.editUser(this.formData).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        if (this.lang == 'en') {
          this.toaster.success("Data Saved Successfully");
        } else {
          this.toaster.success("تمت الاضافة بنجاح");
        }
        this.GetUsersData();
        this.formGroup?.reset();
        this.modalService.dismissAll();
        this.selectedFile = null;

      } else {
        this.toaster.error(data.message);


      }
    });
  }



  openDeleteUserModal(content: any, userModel: UserModel) {
    this.userModel = userModel;
    this.modalService.open(content, { size: 'md', centered: true });
  }
  deleteUser() {
    this.settingsService.deleteUser(this.userModel.userId).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        if (this.lang == 'en') {
          this.toaster.success("user deleted");
        } else {
          this.toaster.success("تمت الحذف بنجاح");
        }
        this.GetUsersData();
        this.formGroup?.reset();
        this.modalService.dismissAll();
        this.selectedFile = null;

      } else {
        if (this.lang == 'en') {
          this.toaster.error("! Error Failed To delete");
        } else {
          this.toaster.error("لقد حدث خطا");
        }

      }
    });
  }
  openResetPasswordModel(content: any, userId: any) {
    this.UserId = userId;
    this.modalService.open(content, { size: 'md', centered: true });
  }
  resetUserPassword() {
    // this.UserId ;
    // let model = {
    //   UserId: this.UserId,
    //   PasswordHash: '0000'
    // }
    // this.mainService.ChangePassword(model).subscribe(data => {
    //   if (data) {
    //     this.toaster.success('password rested successfully');
    //     this.modalService.dismissAll();
    //   } else {
    //     this.toaster.error('reset password failed');
    //   }
    // });   
  }

  GetUsersData() {
    // this.searchFilterModel.searchText = this.searchText;
    this.settingsService.getUsers(this.pagedResponseModel).subscribe(response => {
      this.pagedResponseModel.results = response.results;
      this.pagedResponseModel.totalCount = response.totalCount;
      this.usersData = response.results;
      this.selectedUser = this.usersData?.length ? this.usersData[0] : null;
      this.totalCount = response.toDate;

    });
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.GetUsersData();
  }

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.GetUsersData();
  }

  onSelectedFile(event: any) {
    this.URLs = [];
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = (events: any) => {
        this.URLs.push(events.target.result);
      }
      // for (let x = 0; x < event.target.files.length; x++) {
      //   var reader = new FileReader();
      //   reader.readAsDataURL(event.target.files[x]);
      //   reader.onload = (events: any) => {
      //     this.URLs.push(events.target.result);
      //   }
      // }
    }
    // var files = event.target.files;
    // for (let i = 0; i < files.length; i++) {
    //   this.ImagesName.push(event.target.files[i].name);
    // }
  }



  open(content: any, user: any) {
    this.form.reset();
    this.BranchValidate = false;
    //this.BranchName = 'Branches';
    this.form.patchValue({ passwordHash: '0000' });
    if (user) {
      this.FillEditForm(user);
    }
    this.modalService.open(content, { size: 'lg', centered: true });
  }



  openRolesModal(content: any, userModel: UserModel) {
    this.userModel = userModel;
    this.getRoles();
    this.modalService.open(content, { size: 'lg', centered: true });
  }
  getRoles() {
    this.settingsService.getRoles(this.pagedResponseModel).subscribe(data => {
      this.rolesList = data.results;
      this.rolesList.map(a => a.isChecked = this.userModel?.roles?.some(r => a.roleName == r));
    });
  }

  saveUserRole() {
    let roles = this.rolesList.filter(a => a.isChecked);
    if (roles.length == 0) {
      this.toaster.error('You must select at least one role');
      return;
    }
    let model: AddUserRoleModel = {} as AddUserRoleModel;
    model.userId = this.userModel.userId;
    model.roles = roles;


    this.showLoader = true;
    this.settingsService.assignUserRole(model).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success('Assign New Role Successfully');
        this.modalService?.dismissAll();
        this.GetUsersData();
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


  FillEditForm(user: any) {
    //this.BranchName = this.Branches?.find(i => i.branchId == user.branchId)?.nameEn;
    this.form.setValue({
      userId: user.userId,
      fullName: user.fullName,
      userName: user.userName,
      passwordHash: user.passwordHash,
      normalizedEmail: user.email,
      phoneNumber: user.phoneNumber,
      branchId: user.branchId,
      image: user.image,
      imageFile: null
    });

    //this.UserImage = user.image;
  }

  exportData() {

  }

}
