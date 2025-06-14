import { Component, OnInit } from '@angular/core';
import { SystemSettingsService } from '../../services/system-settings.service';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { RoleModel } from 'src/app/components/Shared/models/RoleModel';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/components/Shared/services/form.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  TitleList = ['إعدادات النظام', 'صلاحيات المستتخدمين'];
  showLoader: boolean;
  pagedResponseModel: PagedResponseDTO<RoleModel[]> = {
    currentPage: 1,
    pageSize: 10,
    results: [],
    filterList: [],
    searchText: ''
  }
  roleName: string = '';
  public formGroup: FormGroup;
  formData: FormData = new FormData();
  public formErrors = {
    roleId: '',
    roleName: ''
  };

  constructor(private systemSettingsService: SystemSettingsService,
    private toaster: ToastrService,
    private fb: FormBuilder,
    private formService: FormService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles() {
    this.showLoader = true;
    this.systemSettingsService.getRoles(this.pagedResponseModel).subscribe((data: any) => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;
      this.pagedResponseModel.currentPage = data.currentPage;
      this.pagedResponseModel.pageSize = data.pageSize;
      this.pagedResponseModel.totalPages = data.totalPages;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }

  // openAddRoleModel(content: any) {
  //   this.roleName = '';
  //   this.modalService.open(content, { size: 'md', centered: true });
  // }

  openRolePopup(content: any, roleId: number = null, roleName: string = null) {
    this.buildForm();
    if (roleId != null) {
      this.formGroup.patchValue({
        roleId: roleId,
        roleName: roleName,
      });
    }
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  buildForm() {
    this.formGroup = this.fb.group({
      roleName: [null, [Validators.required]],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this.formService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  addNewRole() {
    if (!this.roleName || this.roleName?.length < 3) {
      this.toaster.warning('Please enter a role name and must be at least 3 characters');
      return
    }
    this.showLoader = true;
    this.systemSettingsService.addNewRole(this.roleName).subscribe((data: ActionsResponseModel) => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
        this.modalService?.dismissAll();
        this.getRoles();
      }
      else {
        this.toaster.error(data.message);
      }
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getRoles();
  }

}
