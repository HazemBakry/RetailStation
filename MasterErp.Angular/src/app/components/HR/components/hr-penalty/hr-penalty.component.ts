
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { HrService } from '../../services/hr.service';
import { DatePipe } from '@angular/common';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { EmployeePenaltyModel } from '../../models/EmployeePenaltyModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { CustomValidators } from 'src/app/components/Shared/services/custom-validators';
import { EmployeeContractModel } from '../../models/Employee/EmployeeContractModel';

@Component({
  selector: 'app-hr-penalty',
  templateUrl: './hr-penalty.component.html',
  styleUrls: ['./hr-penalty.component.css']
})
export class HrPenaltyComponent implements OnInit {
  VacationData: any[] = [];
  employeeSelectorData: FormDropdownModel[] = [];
  penaltyTypeSelectorData: FormDropdownModel[] = [];
  selectedPenaltyId: number;
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  employeeContract: EmployeeContractModel;
  selectedEmployeeId: number = null;
  isUpdate: boolean = false;

  employeePenaltyModel: EmployeePenaltyModel = {} as EmployeePenaltyModel;
  employeePenaltyResponse: PagedResponseDTO<EmployeePenaltyModel[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: ''
  };

  public formGroup: FormGroup;
  public formErrors = {
    penaltyId: '',
    employeeId: '',
    penaltyTypeId: '',
    executionDate: '',
    deductionByDays: '',
    deductionAmount: '',
    totalDeduction: '',
    reason: ''
  };

  constructor(private modalService: NgbModal, private hrService: HrService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.getActiveEmployeesSelector();
  }

  getPenaltiesByEmployeeId() {
    if (!this.checkEmployee())
      return;

    this.showLoader = true;
    this.hrService.GetPenaltiesByEmployeeId(this.selectedEmployeeId, this.employeePenaltyResponse).subscribe(data => {
      this.employeePenaltyResponse.results = data.results;
      this.employeePenaltyResponse.totalCount = data.totalCount;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });

    this.getEmployeeContractSalary();
  }

  getEmployeeContractSalary() {
    this.hrService.GetEmployeeContractDetails(this.selectedEmployeeId).subscribe(data => {
      this.employeeContract = data;
    });
  }

  checkEmployee() {
    if (!this.selectedEmployeeId) {
      this.toaster.warning('من فضلك اختر من قائمة الموظفين', 'تحذير');
      return false;
    }
    return true;
  }

  openNewSidePanel(content: any, penaltyModel: EmployeePenaltyModel = null) {
    if (!this.checkEmployee())
      return;
    this.isUpdate = false;
    this.buildForm();
    if (penaltyModel)
      this.fillEditForm(penaltyModel);

    this.formGroup.patchValue({ employeeId: this.selectedEmployeeId });
    this.getPenaltyTypesSelector();
    this.offcanvasService.open(content, { panelClass: 'add-new-panel', position: 'end' });
  }

  buildForm() {
    this.formGroup = this.form.group({
      penaltyId: [null],
      employeeId: [null],
      penaltyTypeId: [null, [Validators.required]],
      executionDate: [null, [Validators.required]],
      deductionByDays: [null, [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9])?$/)]],
      deductionAmount: [null],//[null, [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9])?$/)]],
      totalDeduction: [null, [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9])?$/)]],
      reason: [null, [Validators.required]],
    }, {
      validators: [CustomValidators.endDateGreaterThanStartDate('lastDayWork', 'fromDate'),
      CustomValidators.endDateGreaterThanStartDate('fromDate', 'toDate')],
    });

    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
    this.formGroup.get('deductionByDays').valueChanges.subscribe(() => {
      this.calculateTotalDeduction();
    });

    this.formGroup.get('deductionAmount').valueChanges.subscribe(() => {
      this.calculateTotalDeduction();
    });
  }

  saveEmployeePenalty() {
    if (!this.validateForm()) {
      return;
    }

    this.employeePenaltyModel = this.formGroup.value;

    if (this.employeePenaltyModel?.penaltyId)
      this.editEmployeePenalty();
    else
      this.addNewEmployeePenalty();
  }

  addNewEmployeePenalty() {
    this.showAddLoader = true;
    this.hrService.AddNewEmployeePenalty(this.selectedEmployeeId, this.employeePenaltyModel).subscribe(data => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.offcanvasService?.dismiss();
        this.getPenaltiesByEmployeeId();
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

  editEmployeePenalty() {
    this.showAddLoader = true;
    this.hrService.EditEmployeePenalty(this.selectedEmployeeId, this.employeePenaltyModel).subscribe(data => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.offcanvasService?.dismiss();
        this.getPenaltiesByEmployeeId();
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

  getPenaltyTypesSelector() {
    this.hrService.GetPenaltyTypesSelector().subscribe((data: FormDropdownModel[]) => {
      this.penaltyTypeSelectorData = data;
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

  fillEditForm(penaltyModel: EmployeePenaltyModel) {
    this.isUpdate = true;
    this.formGroup.patchValue({
      penaltyId: penaltyModel.penaltyId,
      employeeId: this.selectedEmployeeId,
      penaltyTypeId: penaltyModel.penaltyTypeId,
      executionDate: this.datePipe.transform(penaltyModel.executionDate, 'yyyy-MM-dd'),
      deductionByDays: penaltyModel.deductionByDays,
      moneyAmount: penaltyModel.moneyAmount,
      deductionAmount: penaltyModel.deductionAmount,
      reason: penaltyModel.reason
    });
  }

  openDeleteModal(content: any, penaltyDateId: number) {
    this.selectedPenaltyId = penaltyDateId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  getActiveEmployeesSelector() {
    this.hrService.GetActiveEmployeesSelector().subscribe((data: FormDropdownModel[]) => {
      this.employeeSelectorData = data;
    });
  }

  filterChecked(filterItems: FilterItem[]) {
    this.employeePenaltyResponse.filterList = filterItems;
    this.getPenaltiesByEmployeeId();
  }

  pageChanged(obj: any) {
    this.employeePenaltyResponse.currentPage = obj.page;
    this.getPenaltiesByEmployeeId();
  }

  deleteEmployeePenalty() {
    this.showAddLoader = true;
    this.hrService.DeleteEmployeePenalty(this.selectedPenaltyId).subscribe(data => {

      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getPenaltiesByEmployeeId();
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

  calculateTotalDeduction() {
    let deductionByDays = this.formGroup.get('deductionByDays').value;
    let deductionAmount = this.formGroup.get('deductionAmount').value;
    let salaryPerHour = 0;

    if (deductionByDays == null)
      deductionByDays = 0;

    if (deductionAmount == null)
      deductionAmount = 0;

    if (this.employeeContract && this.employeeContract?.basicSalary)
      salaryPerHour = this.employeeContract?.basicSalary / 30;

    this.formGroup.get('totalDeduction').setValue(Math.round(Number(deductionByDays) * Number(salaryPerHour) + Number(deductionAmount)));
  }
}
