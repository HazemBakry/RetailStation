import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { SaveEmployeeModel } from 'src/app/components/HR/models/SaveEmployeeModel';
import { HrService } from '../../services/hr.service';
import { FilterItem, FilterModel, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from 'src/app/components/Shared/services/validation.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
@Component({
  selector: 'app-hr-employees',
  templateUrl: './hr-employees.component.html',
  styleUrls: ['./hr-employees.component.css']
})
export class HrEmployeesComponent implements OnInit {

  UsersData: any[] = [];
  UsersRoles: any[] = [];
  URLs: any[] = [];
  ImagesName: any[] = [];
  Branches: any[] = [];
  filterList: FilterModel[] = [];
  TitleList = ['Users', 'Users'];
  BranchName = 'Branches';
  DefaultImage = '../../../../../assets/av-8.png';
  pagingUsersData: any;
  SearchText = '';
  form: FormGroup;
  UserModel: any;
  UserId: any;
  totalCount: any;
  totalPages: any;
  pageSize: any = 8;
  currentPage: any = 1;
  StartIndex = 0;
  manageRoles = false;
  BranchValidate = false;
  SelectedUser: any;
  SearchFilterModel: SearchFilterModel = {
    currentPage: 1,
    pageSize: 25,
    filterModel: { filterItems: [] }
  };

  constructor(private modalService: NgbModal, private toaster: ToastrService, private hrService: HrService,
    private validationService: ValidationService, private sharedService: SharedService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.UserModel = JSON.parse(localStorage.getItem('UserModel'));
    this.FormInit();
    this.GetEmployeesData();
    this.GetEmployeesFilter();
    this.getBranches();
  }

  FormInit() {
    this.form = this.fb.group({
      employeeId: null,
      fullName: ['', Validators.required],
      userName: ['', Validators.required],
      passwordHash: ['0000', Validators.required],
      normalizedEmail: null,
      phoneNumber: null,
      branchId: null,
      imageFile: null
    });
  }

  FillEditForm(user: any) {
    this.BranchName = this.Branches?.find(i => i.branchId == user.branchId)?.nameEn;
    this.form.setValue({
      employeeId: user.id,
      fullName: user.fullName,
      userName: user.userName,
      passwordHash: user.passwordHash,
      normalizedEmail: user.email,
      phoneNumber: user.phoneNumber,
      branchId: user.branchId,
      imageFile: null
    });
  }

  open(content: any, user: any) {
    this.form.reset();
    this.BranchValidate = false;
    this.BranchName = 'Branches';
    this.form.patchValue({ passwordHash: '0000' });
    if (user) {
      this.FillEditForm(user);
    }
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  resetUserPassword() {
    this.UserId;
    let model = {
      UserId: this.UserId,
      PasswordHash: '0000'
    }
    this.hrService.ChangePassword(model).subscribe(data => {
      if (data) {
        this.toaster.success('password rested successfully');
        this.modalService.dismissAll();
      } else {
        this.toaster.error('reset password failed');
      }
    });
  }

  getBranches() {
    this.hrService.GetBranchData().subscribe(data => {
      this.Branches = data;
    });
  }

  GetEmployeesFilter() {
    this.hrService.GetEmployeesFilter().subscribe(data => {
      this.filterList = data;
    });
  }

  GetEmployeesData() {
    //this.SearchFilterModel.SearchText = this.SearchText;
    this.hrService.GetAllEmployees().subscribe(data => {
      this.UsersData = data;
      this.UsersData[0].isClicked = true;
      this.SelectedUser = this.UsersData[0];
      this.totalCount = data.length;
      this.pagingUsersData = this.UsersData.slice(this.StartIndex, this.StartIndex + this.pageSize);
    });
  }

  filterChecked(filterItems: FilterItem[]) {
    this.SearchFilterModel.filterModel.filterItems = filterItems;
    this.GetEmployeesData();
  }

  pageChanged(obj: any) {
    this.currentPage = obj.page;
    this.StartIndex = (this.currentPage - 1) * this.pageSize;
    this.pagingUsersData = this.UsersData.slice(this.StartIndex, this.StartIndex + this.pageSize);
  }

  onBranchClick(branch: any) {
    this.form.patchValue({ branchId: branch.branchId });
    this.BranchName = branch.nameEn;
    this.BranchValidate = false;
  }

  onSelectedFile(event: any) {
    this.URLs = [];
    this.form.patchValue({ imageFile: event.target.files[0] });
    if (event.target.files) {
      for (let x = 0; x < event.target.files.length; x++) {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[x]);
        reader.onload = (events: any) => {
          this.URLs.push(events.target.result);
        }
      }
    }
    var files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.ImagesName.push(event.target.files[i].name);
    }

  }

  SaveEmployee() {
    let isValidator = false;
    let isValid = this.form.valid;
    if (!isValid) {
      this.sharedService.validateAllFormFields(this.form);
      isValidator = true;
    }

    if (this.form.controls['branchId'].value == null) {
      this.BranchValidate = true;
      isValidator = true;
    }

    if (isValidator)
      return;

    if (!this.form.controls['userId'].value) {
      this.form.patchValue({ userId: 0 });
      let FormValue = this.form.value;
      if (FormValue) {
        const formData = new FormData();
        formData.append("userId", FormValue.userId);
        formData.append("fullName", FormValue.fullName);
        formData.append("userName", FormValue.userName);
        formData.append("passwordHash", FormValue.passwordHash);
        formData.append("normalizedEmail", FormValue.normalizedEmail);
        formData.append("phoneNumber", FormValue.phoneNumber);
        formData.append("branchId", FormValue.branchId);
        formData.append("imageFile", FormValue.imageFile);
        this.hrService.AddNewEmployee(formData).subscribe(data => {
          if (data) {
            this.modalService.dismissAll();
            this.GetEmployeesData();
            this.toaster.success('User Added Successfully');
          } else {
            this.toaster.error('User Added Failure');
          }
        });
      }
    } else {
      this.hrService.EditEmployeeData(this.form.value).subscribe(data => {
        if (data) {
          this.modalService.dismissAll();
          this.GetEmployeesData();
          this.toaster.success('User Edit Successfully');
        } else {
          this.toaster.error('User Edit Failure');
        }
      });
    }


  }

  EditUser() {
    this.hrService.EditEmployeeData(this.form.value).subscribe(data => {
      if (data) {
        this.GetEmployeesData();
        this.toaster.success('User Edit Successfully');
      } else {
        this.toaster.error('User Edit Failure');
      }
    });
  }

  RemoveUser() {
    this.hrService.RemoveEmployee(this.UserId).subscribe(data => {
      if (data) {
        this.GetEmployeesData();
        this.toaster.success('User Delete Successfully');
      } else {
        this.toaster.error('User Delete Failure');
      }
    });
  }

  ShowUserCardData(item: any) {
    this.SelectedUser = item;
    this.UsersData.forEach(user => {
      if (item.id == user.id)
        user.isClicked = true;
      else
        user.isClicked = false;
    })
  }

}
