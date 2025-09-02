import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { HrService } from '../../services/hr.service';
import { DatePipe } from '@angular/common';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { EmployeeAdvanceModel } from '../../models/EmployeeAdvanceModel';
import { HRWorkflowStatus, PaymentWorkflowStatus } from 'src/app/components/Shared/Enums/FinanceWorkflowStatus';

@Component({
  selector: 'app-hr-advances',
  templateUrl: './hr-advances.component.html',
  styleUrls: ['./hr-advances.component.css']
})
export class HrAdvancesComponent implements OnInit {
  VacationData: any[] = [];
  employeeSelectorData: FormDropdownModel[] = [];
  penaltyTypeSelectorData: FormDropdownModel[] = [];
  selectedAdvanceId: number;
  employeeAdvanceModel: EmployeeAdvanceModel = {} as EmployeeAdvanceModel;
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  public formGroup: FormGroup;
  selectedEmployeeId: number = null;
  isUpdate: boolean = false;
  public workflowStatus = HRWorkflowStatus;
  employeeAdvanceResponse: PagedResponseDTO<EmployeeAdvanceModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''
  };
  public formErrors = {
    employeeAdvanceId: '',
    employeeId: '',
    paymentFromDate: '',
    advanceTypeId: '',
    advanceAmount: '',
    paymentAmount: '',
    isApproved: '',
    notes: ''
  };

  constructor(private modalService: NgbModal, private hrService: HrService, private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.getActiveEmployeesSelector();
  }
  getAdvanceByEmployeeId() {
    if (!this.checkEmployee())
      return;

    this.showLoader = true;
    this.hrService.GetAdvancesByEmployeeId(this.selectedEmployeeId, this.employeeAdvanceResponse).subscribe(data => {
      this.employeeAdvanceResponse.results = data.results;
      this.employeeAdvanceResponse.totalCount = data.totalCount;

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

  openNewSidePanel(content: any, advanceModel: EmployeeAdvanceModel = null) {
    if (!this.checkEmployee())
      return;

    this.getAdvanceTypesSelector();

    this.isUpdate = false;
    this.buildForm();
    if (advanceModel)
      this.fillEditForm(advanceModel);

    this.formGroup.patchValue({ employeeId: this.selectedEmployeeId });

    this.offcanvasService.open(content, { panelClass: 'add-new-panel', position: 'end' });
  }
  buildForm() {

    this.formGroup = this.form.group({
      employeeAdvanceId: [null],
      employeeId: [null],
      advanceTypeId: [null, [Validators.required]],
      advanceAmount: [null, [Validators.required, CustomValidators.regexPattern(RegexType.number)]],
      paymentAmount: [null, [Validators.required, CustomValidators.regexPattern(RegexType.number)]],
      isApproved: [null],
      paymentFromDate: [null, [Validators.required, CustomValidators.dateGreaterThan(new Date(), 'ادخل تاربخ اكبر')]],
      notes: [null],

    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });

  }

  saveEmployeeAdvance() {
    if (!this.validateForm()) {
      return;
    }
    this.employeeAdvanceModel = this.formGroup.value;
    if (this.employeeAdvanceModel?.employeeAdvanceId)
      this.editEmployeeAdvance();
    else
      this.addNewEmployeeAdvance();
  }

  addNewEmployeeAdvance() {

    this.showAddLoader = true;
    this.hrService.AddNewEmployeeAdvance(this.selectedEmployeeId, this.employeeAdvanceModel).subscribe(data => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.offcanvasService?.dismiss();
        this.getAdvanceByEmployeeId();
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

  editEmployeeAdvance() {

    this.showAddLoader = true;
    this.hrService.EditEmployeeAdvance(this.selectedEmployeeId, this.employeeAdvanceModel).subscribe(data => {

      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.offcanvasService?.dismiss();
        this.getAdvanceByEmployeeId();
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


  fillEditForm(advanceModel: EmployeeAdvanceModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      employeeAdvanceId: advanceModel.employeeAdvanceId,
      advanceTypeId: advanceModel.advanceTypeId,
      advanceAmount: advanceModel.advanceAmount,
      paymentAmount: advanceModel.paymentAmount,
      isApproved: advanceModel.isApproved,
      employeeId: this.selectedEmployeeId,
      paymentFromDate: this.datePipe.transform(advanceModel.paymentFromDate, 'yyyy-MM-dd'),
      notes: advanceModel.notes
    });
  }


  openDeleteModal(content: any, employeeAdvanceId: number) {
    this.selectedAdvanceId = employeeAdvanceId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  getActiveEmployeesSelector() {
    this.hrService.GetActiveEmployeesSelector().subscribe((data: FormDropdownModel[]) => {
      this.employeeSelectorData = data;
    });
  }

  filterChecked(filterItems: FilterItem[]) {
    this.employeeAdvanceResponse.filterList = filterItems;
    this.getAdvanceByEmployeeId();
  }

  pageChanged(obj: any) {
    this.employeeAdvanceResponse.currentPage = obj.page;
    this.getAdvanceByEmployeeId();
  }


  deleteEmployeeAdvance() {
    this.showAddLoader = true;
    this.hrService.DeleteEmployeeAdvance(this.selectedAdvanceId).subscribe(data => {

      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getAdvanceByEmployeeId();
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

  openApproveModal(content: any, employeeAdvanceId: number) {
    this.selectedAdvanceId = employeeAdvanceId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }
  approveEmployeeAdvance() {
    this.showAddLoader = true;
    this.hrService.ApproveEmployeeAdvance(this.selectedAdvanceId).subscribe(data => {

      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getAdvanceByEmployeeId();
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
  
  advanceTypesSelectorData: FormDropdownModel[] = [];
  getAdvanceTypesSelector() {
    this.hrService.GetAdvanceTypesSelector().subscribe((data: FormDropdownModel[]) => {
      this.advanceTypesSelectorData = data;
    });
  }

}


