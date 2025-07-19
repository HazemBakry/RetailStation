import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { HrService } from '../../services/hr.service';
import { DatePipe } from '@angular/common';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { EmployeeCareerModel } from '../../models/EmployeeCareerModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { CustomValidators } from 'src/app/components/Shared/services/custom-validators';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';
import { JobWorkflowStatus, WorkflowStatusGroup } from 'src/app/components/Shared/Enums/FinanceWorkflowStatus';

@Component({
  selector: 'app-hr-careers',
  templateUrl: './hr-careers.component.html',
  styleUrls: ['./hr-careers.component.css']
})
export class HrCareersComponent implements OnInit {
  VacationData: any[] = [];

  employeeSelectorData: FormDropdownModel[] = [];
  penaltyTypeSelectorData: FormDropdownModel[] = [];

  selectedEmployeeCareerId: number;

  employeeCareerModel: EmployeeCareerModel = {} as EmployeeCareerModel;
  employeeCareerResponse: PagedResponseDTO<EmployeeCareerModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''

  };
  showLoader: boolean = false;
  showAddLoader: boolean = false;

  public formGroup: FormGroup;
  public formErrors = {
    employeeCareerId: '',
    employeeId: '',
    executionDate: '',
    jobId: '',
    branchId: '',
    WorkFlowStatusId: '',
    notes: '',
    timeFrom: '',
    timeTo: '',

  };

  selectedEmployeeId: number = null;
  isUpdate: boolean = false;
  constructor(private modalService: NgbModal,
    private hrService: HrService,
    private sharedService: SharedService,
    private form: FormBuilder,
    private _FormService: FormService,
    private datePipe: DatePipe,
    private toaster: ToastrService,
    private lookupService: LookupService,
    private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.getActiveEmployeesSelector();
  }
  getCareerByEmployeeId() {
    if (!this.checkEmployee())
      return;


    this.showLoader = true;
    this.hrService.GetCareersByEmployeeId(this.selectedEmployeeId, this.employeeCareerResponse).subscribe(data => {
      this.employeeCareerResponse.results = data.results;
      this.employeeCareerResponse.totalCount = data.totalCount;

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });


  }

  checkEmployee() {

    if (!this.selectedEmployeeId) {
      this.toaster.warning('من فضلك اختر من قائمة الموظفين', 'تحذير');
      return false;
    }
    return true;
  }
  openNewSidePanel(content: any, careerModel: EmployeeCareerModel = null) {
    if (!this.checkEmployee())
      return;

    this.getBranchesSelector();
    this.getJobsSelector();
    this.getWorkStatusSelector();
    this.isUpdate = false;
    this.buildForm();
    if (careerModel)
      this.fillEditForm(careerModel);

    this.formGroup.patchValue({ employeeId: this.selectedEmployeeId });

    this.offcanvasService.open(content, { panelClass: 'add-new-panel', position: 'end' });
  }
  buildForm() {
    this.formGroup = this.form.group({
      employeeCareerId: [null],
      employeeId: [null],
      jobId: [null, [Validators.required]],
      branchId: [null, [Validators.required]],
      WorkFlowStatusId: [null, [Validators.required]],
      executionDate: [null, [Validators.required, CustomValidators.dateGreaterThan(new Date(), 'ادخل تاربخ اكبر')]],
      notes: [null],

    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });

  }

  saveEmployeeCareer() {
    if (!this.validateForm()) {
      return;
    }
    this.employeeCareerModel = this.formGroup.value;
    if (this.employeeCareerModel?.employeeCareerId)
      this.editEmployeeCareer();
    else
      this.addNewEmployeeCareer();
  }

  addNewEmployeeCareer() {
    this.showAddLoader = true;
    this.hrService.AddNewEmployeeCareer(this.selectedEmployeeId, this.employeeCareerModel).subscribe(data => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.offcanvasService?.dismiss();
        this.getCareerByEmployeeId();
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

  editEmployeeCareer() {

    this.showAddLoader = true;
    this.hrService.EditEmployeeCareer(this.selectedEmployeeId, this.employeeCareerModel).subscribe(data => {

      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.offcanvasService?.dismiss();
        this.getCareerByEmployeeId();
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

  validateForm(): boolean {
    this._FormService.markFormGroupTouched(this.formGroup);
    if (this.formGroup.valid) {
      return true;
    } else {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, false)
      return false;
    }
  }


  fillEditForm(careerModel: EmployeeCareerModel) {
    this.isUpdate = true;
    this.formGroup.patchValue({
      employeeCareerId: careerModel.employeeCareerId,
      jobId: careerModel.jobId,
      branchId: careerModel.branchId,
      WorkFlowStatusId: careerModel.workStatusId,
      employeeId: this.selectedEmployeeId,
      executionDate: this.datePipe.transform(careerModel.executionDate, 'yyyy-MM-dd'),
      notes: careerModel.notes
    });
  }


  openDeleteModal(content: any, employeeCareerId: number) {
    this.selectedEmployeeCareerId = employeeCareerId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  getActiveEmployeesSelector() {
    this.hrService.GetActiveEmployeesSelector().subscribe((data: FormDropdownModel[]) => {
      this.employeeSelectorData = data;
    });
  }

  filterChecked(filterItems: FilterItem[]) {
    this.employeeCareerResponse.filterList = filterItems;
    this.getCareerByEmployeeId();
  }

  pageChanged(obj: any) {
    this.employeeCareerResponse.currentPage = obj.page;
    this.getCareerByEmployeeId();
  }


  deleteEmployeeCareer() {
    this.showAddLoader = true;
    this.hrService.DeleteEmployeeCareer(this.selectedEmployeeCareerId).subscribe(data => {

      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getCareerByEmployeeId();
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
  workStatusSelectorData: FormDropdownModel[] = [];
  getWorkStatusSelector() {
    this.lookupService.GetWorkStatusSelector(WorkflowStatusGroup.Job).subscribe((data: FormDropdownModel[]) => {
      this.workStatusSelectorData = data;
    });
  }
  jobsSelectorData: FormDropdownModel[] = [];
  getJobsSelector() {
    this.hrService.GetJobsSelector().subscribe((data: FormDropdownModel[]) => {
      this.jobsSelectorData = data;
    });
  }
  branchesSelectorData: FormDropdownModel[] = [];
  getBranchesSelector() {
    this.sharedService.GetBranchesSelector().subscribe((data: FormDropdownModel[]) => {
      this.branchesSelectorData = data;
    });
  }
}

