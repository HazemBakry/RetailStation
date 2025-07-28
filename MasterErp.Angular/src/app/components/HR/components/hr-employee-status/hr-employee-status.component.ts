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
import { EmployeeStatusModel } from '../../models/EmployeeStatusModel';

@Component({
  selector: 'app-hr-employee-status',
  templateUrl: './hr-employee-status.component.html',
  styleUrls: ['./hr-employee-status.component.css']
})
export class HrEmployeeStatusComponent implements OnInit {



  TitleList = ['الموارد البشرية', 'حالات الموظف'];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  pagedResponse: PagedResponseDTO<EmployeeStatusModel[]> = {
    currentPage: 1,
    pageSize: 10,
    results: [],
    filterList: [],
    searchText: ''
  }
  employeeStatusModel: EmployeeStatusModel = {} as EmployeeStatusModel;

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
    this._hrService.GetEmployeeStatusData(this.pagedResponse).subscribe((data: any) => {
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
    employeeStatusId: '',
    statusNameAR: '',
    statusNameEN: '',
    isActive: '',
    notes: '',

  };
  employeeStatusTypesSelectorData: GeneralSelectorModel[] = [];
  selectedEmployeeStatusId: number;
  openAddModal(content: any, EmployeeStatusModel: EmployeeStatusModel = null) {
    this.loadSelectors();
    this.isUpdate = false;
    this.buildForm();
    if (EmployeeStatusModel)
      this.fillEditForm(EmployeeStatusModel);

    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });
  }
  loadSelectors() {


  }
  buildForm() {
    this.formGroup = this.form.group({
      employeeStatusId: [null],
      statusNameAR: [null, [Validators.required]],
      statusNameEN: [null, [Validators.required]],
      notes: [null],
      isActive: [true, [Validators.required]],

    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });

  }

  saveRecord() {
    if (!this.validateForm()) {
      return;
    }
    this.employeeStatusModel = this.formGroup.value;
    if (this.employeeStatusModel?.employeeStatusId)
      this.editNewEmployeeStatus();
    else
      this.addNewEmployeeStatus();
  }

  addNewEmployeeStatus() {

    this.showAddLoader = true;
    this._hrService
      .CreateNewEmployeeStatus(this.employeeStatusModel).subscribe(data => {
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

  editNewEmployeeStatus() {


    this.showAddLoader = true;
    this._hrService
      .EditEmployeeStatus(this.employeeStatusModel.employeeStatusId, this.employeeStatusModel).subscribe(data => {

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

  fillEditForm(EmployeeStatusModel: EmployeeStatusModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      employeeStatusId: EmployeeStatusModel.employeeStatusId,
      statusNameAR: EmployeeStatusModel.statusNameAR,
      statusNameEN: EmployeeStatusModel.statusNameEN,
      isActive: EmployeeStatusModel.isActive,
      notes: EmployeeStatusModel.notes,
    });
  }
  openDeleteModal(content: any, id: number) {
    this.selectedEmployeeStatusId = id;
    this.modalService.open(content, { centered: true, size: 'sm' });
  }

  deleteEmployeeStatus() {
    this.showAddLoader = true;
    this._hrService.DeleteEmployeeStatus(this.selectedEmployeeStatusId).subscribe(data => {

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
