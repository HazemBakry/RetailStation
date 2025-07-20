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
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';
import { JobWorkflowStatus, WorkflowStatusGroup } from 'src/app/components/Shared/Enums/FinanceWorkflowStatus';
import { EmployeeContractModel } from '../../models/Employee/EmployeeContractModel';
import { EmployeeService } from '../../services/employee.service';

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
  employeeContractInfoModel: EmployeeContractModel;

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
    modifySalary: '',

    basicSalary: '',
    extraSalary: '',
    transportation: '',
    housingAllowance: '',
    mobileAllowance: '',
    workNature: '',
    mealAllowance: '',
    other: '',

  };

  selectedEmployeeId: number = null;
  isUpdate: boolean = false;
  constructor(private modalService: NgbModal,
    private hrService: HrService,
    private employeeService: EmployeeService,
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
    else
      this.getEmployeeContractInfo();
    this.formGroup.patchValue({ employeeId: this.selectedEmployeeId });

    this.offcanvasService.open(content, { panelClass: 'add-new-panel', position: 'end' });
  }
  getEmployeeContractInfo() {

    this.employeeService.GetEmployeeContractInfoById(this.selectedEmployeeId).subscribe((data: EmployeeContractModel) => {
      this.employeeContractInfoModel = data;

      if (data?.basicSalary) {
        this.formGroup.patchValue({
          basicSalary: data.basicSalary,
          extraSalary: data.extraSalary,
          transportation: data.transportation,
          housingAllowance: data.housingAllowance,
          mobileAllowance: data.mobileAllowance,
          workNature: data.workNature,
          mealAllowance: data.mealAllowance,
          other: data.other,
        });
      }

    }, err => {
    }, () => {
    });


  }
  buildForm() {
    this.formGroup = this.form.group({
      employeeCareerId: [null],
      employeeId: [null],
      jobId: [null, [Validators.required]],
      branchId: [null, [Validators.required]],
      //WorkFlowStatusId: [null, [Validators.required]],
      executionDate: [null, [Validators.required, CustomValidators.dateGreaterThan(new Date(), 'ادخل تاربخ اكبر')]],
      notes: [null],
      modifySalary: [false],

      //salary section
      basicSalary: [null, [CustomValidators.regexPattern(RegexType.number)]],
      extraSalary: [null, [CustomValidators.regexPattern(RegexType.number)]],
      transportation: [null, [CustomValidators.regexPattern(RegexType.number)]],
      housingAllowance: [null, [CustomValidators.regexPattern(RegexType.number)]],
      mobileAllowance: [null, [CustomValidators.regexPattern(RegexType.number)]],
      workNature: [null, [CustomValidators.regexPattern(RegexType.number)]],
      mealAllowance: [null, [CustomValidators.regexPattern(RegexType.number)]],
      other: [null, [CustomValidators.regexPattern(RegexType.number)]]

    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
    this.formGroup.get('modifySalary').valueChanges.subscribe((value) => {
      if (value)
        this._FormService.updateFieldsRequiredValidation(this.formGroup, 'basicSalary', true);
      else
        this._FormService.updateFieldsRequiredValidation(this.formGroup, 'basicSalary', false);
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
      notes: careerModel.notes,
      basicSalary: careerModel.basicSalary,
      extraSalary: careerModel.extraSalary,
      transportation: careerModel.transportation,
      housingAllowance: careerModel.housingAllowance,
      mobileAllowance: careerModel.mobileAllowance,
      workNature: careerModel.workNature,
      mealAllowance: careerModel.mealAllowance,
      other: careerModel.other,
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

