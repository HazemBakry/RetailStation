import { Component, OnInit } from '@angular/core';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';
import { HrService } from '../../services/hr.service';
import { DepartmentModel } from '../../models/DepartmentModel';

@Component({
  selector: 'app-hr-departments',
  templateUrl: './hr-departments.component.html',
  styleUrls: ['./hr-departments.component.css']
})
export class HrDepartmentsComponent implements OnInit {



  TitleList = ['الموارد البشرية', 'الاقسام'];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  pagedResponse: PagedResponseDTO<DepartmentModel[]> = {
    currentPage: 1,
    pageSize: 10,
    results: [],
    filterList: [],
    searchText: ''
  }
  departmentModel: DepartmentModel =
    {} as DepartmentModel;

  constructor(private _hrService: HrService, private toaster: ToastrService,
    private sharedService: SharedService,
    private modalService: NgbModal,
    private lookupService: LookupService,
    private form: FormBuilder,
    private _FormService: FormService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader = true;
    this._hrService.GetDepartmentsData(this.pagedResponse).subscribe((data: any) => {
      this.pagedResponse.results = data.results;
      this.pagedResponse.totalCount = data.totalCount;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }



  pageChanged(obj: any) {
    this.pagedResponse.currentPage = obj.page;
    this.loadData();
  }



  ////////////////////////////  Actions /////////////////////////////


  isUpdate: boolean = false;
  public formGroup: FormGroup;
  public formErrors = {
    departmentId: '',
    code: '',
    nameAR: '',
    nameEN: '',
    isActive: '',
    isSystem: '',
    branchId: '',
    location: '',
    managerId: '',
    description: '',

  };
  branchesSelectorData: GeneralSelectorModel[] = [];
  employeesSelectorData: GeneralSelectorModel[] = [];

  selectedDepartmentId: number;
  openAddModal(content: any, departmentModel: DepartmentModel = null) {
    this.loadSelectors();
    this.isUpdate = false;
    this.buildForm();
    if (departmentModel)
      this.fillEditForm(departmentModel);

    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });
  }
  loadSelectors() {
    this.sharedService.GetBranchesSelector().subscribe(data => {
      this.branchesSelectorData = data;
    });
    this._hrService.GetActiveEmployeesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.employeesSelectorData = data;
    });
  }
  buildForm() {
    this.formGroup = this.form.group({
      departmentId: [null],
      code: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      branchId: [null],
      location: [null],
      managerId: [null],
      isActive: [true],
      isSystem: [false],
      description: [null],

    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });

  }

  saveRecord() {
    if (!this.validateForm()) {
      return;
    }
    this.departmentModel = this.formGroup.value;
    if (this.departmentModel?.departmentId)
      this.editNewDepartment();
    else
      this.addNewDepartment();
  }

  addNewDepartment() {

    this.showAddLoader = true;
    this._hrService
      .CreateNewDepartment(this.departmentModel).subscribe(data => {
        if (data?.isSuccess) {
          this.formGroup?.reset();
          this.modalService?.dismissAll();
          this.loadData();
          this.toaster.success(data?.message);
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

  editNewDepartment() {


    this.showAddLoader = true;
    this._hrService
      .EditDepartment(this.departmentModel.departmentId, this.departmentModel).subscribe(data => {

        if (data?.isSuccess) {
          // this.formGroup?.reset();
          this.isUpdate = false;
          this.modalService?.dismissAll();
          this.formGroup?.reset();
          this.toaster.success(data?.message);

          this.loadData();
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

  validateForm(): boolean {
    this._FormService.markFormGroupTouched(this.formGroup);
    if (this.formGroup.valid) {
      return true;
    } else {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, false)
      return false;
    }
  }

  fillEditForm(departmentModel: DepartmentModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      departmentId: departmentModel.departmentId,
      code: departmentModel.code,
      nameAR: departmentModel.nameAR,
      nameEN: departmentModel.nameEN,
      isSystem: departmentModel.isSystem,
      description: departmentModel.description,
      branchId: departmentModel.branchId,
      location: departmentModel.location,
      managerId: departmentModel.managerId,

    });
  }
  openDeleteModal(content: any, id: number) {
    this.selectedDepartmentId = id;
    this.modalService.open(content, { centered: true, size: 'sm' });
  }

  deleteDepartment() {
    this.showAddLoader = true;
    this._hrService.DeleteDepartment(this.selectedDepartmentId).subscribe(data => {

      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.loadData();
        this.toaster.success(data?.message);
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


}
