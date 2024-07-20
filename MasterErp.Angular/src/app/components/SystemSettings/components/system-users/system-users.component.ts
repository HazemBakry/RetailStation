import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FilterModel, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { UserModel } from 'src/app/components/Shared/models/UserModel';
import { environment } from 'src/environments/environment';
import { SystemSettingsService } from '../../services/system-settings.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { AuthService } from 'src/app/Auth/auth.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';
import { AddUserRoleModel, RoleModel } from 'src/app/components/Shared/models/RoleModel';

@Component({
  selector: 'app-system-users',
  templateUrl: './system-users.component.html',
  styleUrls: ['./system-users.component.css']
})
export class SystemUsersComponent implements OnInit {
  usersData: UserModel[] = [];
  UsersRoles: any[] = [];
  URLs: any[] = [];
  ImagesName: any[] = [];
 
  systemUrl:string=environment.systemUrl
  filterList: FilterModel[] = [];
  lang :string= 'en';
  
  defaultImage = `${this.systemUrl}assets/images/av-8.png`;
  pagingUsersData: any;
  searchText = '';
  // form: FormGroup;
  userModel: UserModel ={} as UserModel;
  UserId: any;
  totalCount: any;
  totalPages: any;
  pageSize: any = 8;
  currentPage: any = 1;
  StartIndex = 0;
  manageRoles = false;
  BranchValidate = false;
  selectedUser: any;
  rolesList:RoleModel[]=[];
  searchFilterModel: SearchFilterModel = {
    currentPage: 1,
    pageSize: 25,
    filterModel: { filterItems: [] }
  };
  pagedResponse:PagedResponseDTO<UserModel[]>={
    results:[],
    filterList:[],
    pageSize: 25,
    currentPage:1,
    searchText:''

  }

  public formGroup: FormGroup;
  formData: FormData = new FormData();
  selectedFile: File;
  public formErrors = {
    userId: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    userName: '',
    email: '',
    password: '',
    
  };
  showLoader: boolean=false;
  constructor(private modalService: NgbModal, private toaster: ToastrService,
    private settingsService: SystemSettingsService, private form: FormBuilder, private _FormService: FormService,
    private sharedService: SharedService,private authService: AuthService) { }

  ngOnInit(): void {
    this.GetUsersData();
  }

  openUserPopup(content: any,user:UserModel=null) {
    this.buildForm();
    this.URLs=[];
    if (user!=null)
      this.fillEditForm(user)
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  buildForm() {
    this.formGroup = this.form.group({
      userId: [null],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      userName: [null, [Validators.required]],
      phoneNumber: [null],
      email: [null, [Validators.required,Validators.email]],
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
      userName: user.userName,
      email: user.email,
      phoneNumber: user.phoneNumber,
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
      if (this.formGroup.value[key]&&key!='image') {
        this.formData.append(key, this.formGroup.value[key]);
      }
    }

    if(this.userModel?.userId)
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
        this.selectedFile=null;
        
      
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
    this.settingsService.editUser(this.formData).subscribe((data:ActionsResponseModel) => {
      if (data?.isSuccess) {
        if (this.lang == 'en') {
          this.toaster.success("Data Saved Successfully");
        } else {
          this.toaster.success("تمت الاضافة بنجاح");
        }
        this.GetUsersData();
        this.formGroup?.reset();
        this.modalService.dismissAll();
        this.selectedFile=null;
      
      } else {
        if (this.lang == 'en') {
          this.toaster.error("! Error Failed To Save Data");
        } else {
          this.toaster.error("لقد حدث خطا");
        }

      }
    });
  }

 

  openDeleteUserModal(content: any, userModel: UserModel) {
    this.userModel = userModel;
    this.modalService.open(content, { size: 'md', centered: true });
  }
  deleteUser() {
    this.settingsService.deleteUser(this.userModel.userId).subscribe((data:ActionsResponseModel) => {
      if (data?.isSuccess) {
        if (this.lang == 'en') {
          this.toaster.success("user deleted");
        } else {
          this.toaster.success("تمت الحذف بنجاح");
        }
        this.GetUsersData();
        this.formGroup?.reset();
        this.modalService.dismissAll();
        this.selectedFile=null;
      
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
    this.settingsService.getUsers(this.pagedResponse).subscribe(response => {
      this.pagedResponse.results=response.results;
      this.pagedResponse.totalCount=response.totalCount;
      this.usersData = response.results;
      this.selectedUser = this.usersData?.length ?this.usersData[0]:null;
      this.totalCount = response.toDate;

    });
  }

  pageChanged(obj: any) {
    this.pagedResponse.currentPage = obj.page;
    this.GetUsersData();
  }

  onSelectedFile(event: any) {
    this.URLs = [];
    if (event.target.files.length > 0) {
      this.selectedFile=event.target.files[0];
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

  openRolesModal(content: any, userModel: UserModel) {
    this.userModel = userModel;
    this.getRoles();
    this.modalService.open(content, { size: 'lg', centered: true });
}
  getRoles() {
    this.settingsService.getRoles(this.pagedResponse).subscribe(data => {
      this.rolesList = data.results;
      this.rolesList.map(a => a.isChecked = this.userModel?.roles?.some(r=>a.roleName==r));
    });
  }

   saveUserRole() {
    let roles = this.rolesList.filter(a => a.isChecked);
    if(roles.length==0){
      this.toaster.error('You must select at least one role');
      return;
    }
    let model:AddUserRoleModel={} as AddUserRoleModel;
    model.userId=this.userModel.userId;
    model.roles=roles;


    this.showLoader=true;
    this.settingsService.assignUserRole(model).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success('Assign New Role Successfully');
        this.modalService?.dismissAll();
        this.GetUsersData();
      } else {
        this.toaster.error(data.message);
      }
      this.showLoader=false;
    },(err)=>{
      this.showLoader=false;
    },()=>{
      this.showLoader=false;
    })
  }



  ShowUserCardData(item: any) {
    this.selectedUser = item;
    // this.UsersData.forEach(user => {
    //   if (item.id == user.id)
    //     user.isClicked = true;
    //   else
    //     user.isClicked = false;
    // })
  }
}
