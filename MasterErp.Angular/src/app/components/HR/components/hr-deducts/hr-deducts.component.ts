import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { HrService } from '../../services/hr.service';
import { DatePipe } from '@angular/common';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { EmployeeDeductModel } from '../../models/EmployeeDeductModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';
import { SharedService } from 'src/app/components/Shared/services/shared.service';

@Component({
  selector: 'app-hr-deducts',
  templateUrl: './hr-deducts.component.html',
  styleUrls: ['./hr-deducts.component.css']
})
export class HrDeductsComponent implements OnInit {
  VacationData: any[] = [];
  employeeSelectorData: FormDropdownModel[] = [];
  penaltyTypeSelectorData: FormDropdownModel[] = [];
  deductTypesSelectorData: FormDropdownModel[] = [];
  selectedDeductId: number;
  employeeDeductModel: EmployeeDeductModel = {} as EmployeeDeductModel;
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  public formGroup: FormGroup;

  employeeDeductResponse: PagedResponseDTO<EmployeeDeductModel[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: ''
  };

  public formErrors = {
    deductId: '',
    employeeId: '',
    executionDate: '',
    deductTypeId: '',
    moneyAmount: '',
    workflowStatusId: '',
    notes: ''
  };

  selectedEmployeeId: number = null;
  isUpdate: boolean = false;
  constructor(private modalService: NgbModal, private hrService: HrService, private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.getActiveEmployeesSelector();
  }

  getDeductByEmployeeId() {
    if (!this.checkEmployee())
      return;

    this.showLoader = true;
    this.hrService.GetDeductsByEmployeeId(this.selectedEmployeeId, this.employeeDeductResponse).subscribe(data => {
      this.employeeDeductResponse.results = data.results;
      this.employeeDeductResponse.totalCount = data.totalCount;
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

  openNewSidePanel(content: any, deductModel: EmployeeDeductModel = null) {
    if (!this.checkEmployee())
      return;

    this.getDeductTypesSelector();
    this.isUpdate = false;
    this.buildForm();
    if (deductModel)
      this.fillEditForm(deductModel);

    this.formGroup.patchValue({ employeeId: this.selectedEmployeeId });
    this.offcanvasService.open(content, { panelClass: 'add-new-panel', position: 'end' });
  }

  buildForm() {
    this.formGroup = this.form.group({
      deductId: [null],
      employeeId: [null],
      deductTypeId: [null, [Validators.required]],
      moneyAmount: [null, [Validators.required, CustomValidators.regexPattern(RegexType.number)]],
      workflowStatusId: [null],
      executionDate: [null, [Validators.required]],//[null, [Validators.required, CustomValidators.dateGreaterThan(new Date(), 'ادخل تاربخ اكبر')]],
      notes: [null],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  saveEmployeeDeduct() {
    if (!this.validateForm()) {
      return;
    }
    this.employeeDeductModel = this.formGroup.value;
    if (this.employeeDeductModel?.deductId)
      this.editEmployeeDeduct();
    else
      this.addNewEmployeeDeduct();
  }

  addNewEmployeeDeduct() {
    this.showAddLoader = true;
    this.hrService.AddNewEmployeeDeduct(this.selectedEmployeeId, this.employeeDeductModel).subscribe(data => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.offcanvasService?.dismiss();
        this.getDeductByEmployeeId();
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

  editEmployeeDeduct() {
    this.showAddLoader = true;
    this.hrService.EditEmployeeDeduct(this.selectedEmployeeId, this.employeeDeductModel).subscribe(data => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.offcanvasService?.dismiss();
        this.getDeductByEmployeeId();
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

  fillEditForm(deductModel: EmployeeDeductModel) {
    this.isUpdate = true;
    this.formGroup.patchValue({
      deductId: deductModel.deductId,
      deductTypeId: deductModel.deductTypeId,
      moneyAmount: deductModel.moneyAmount,
      workflowStatusId: deductModel.workflowStatusId,
      employeeId: this.selectedEmployeeId,
      executionDate: this.datePipe.transform(deductModel.executionDate, 'yyyy-MM-dd'),
      notes: deductModel.notes
    });
  }

  openDeleteModal(content: any, deductId: number) {
    this.selectedDeductId = deductId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  getActiveEmployeesSelector() {
    this.hrService.GetActiveEmployeesSelector().subscribe((data: FormDropdownModel[]) => {
      this.employeeSelectorData = data;
    });
  }

  filterChecked(filterItems: FilterItem[]) {
    this.employeeDeductResponse.filterList = filterItems;
    this.getDeductByEmployeeId();
  }

  pageChanged(obj: any) {
    this.employeeDeductResponse.currentPage = obj.page;
    this.getDeductByEmployeeId();
  }

  deleteEmployeeDeduct() {
    this.showAddLoader = true;
    this.hrService.DeleteEmployeeDeduct(this.selectedDeductId).subscribe(data => {
      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getDeductByEmployeeId();
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

  getDeductTypesSelector() {
    this.hrService.GetDeductTypesSelector().subscribe((data: FormDropdownModel[]) => {
      this.deductTypesSelectorData = data;
    });
  }
}


