import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { HrService } from '../../services/hr.service';
import { DatePipe } from '@angular/common';
import { FilterItem, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { EmployeeFinancialCustodyModel } from '../../models/EmployeeFinancialCustodyModel';

@Component({
  selector: 'app-hr-financial-custody',
  templateUrl: './hr-financial-custody.component.html',
  styleUrls: ['./hr-financial-custody.component.css']
})
export class HrFinancialCustodyComponent implements OnInit {
  FinancialCustodyData: any[] = [];
  employeeFinancialCustodyData: EmployeeFinancialCustodyModel[] = [];
  employeeSelectorData: GeneralSelectorModel[] = [];
  financialCustodyTypeSelectorData: GeneralSelectorModel[] = [];

  selectedFinancialCustodyId: number;
  CategorySearch: any;
  CategoryName = 'قائمة الموظفين';
  SearchFilterModel: SearchFilterModel = {
    currentPage: 1,
    pageSize: 10,
    filterModel: { filterItems: [] }
  };
  employeeFinancialCustodyModel: EmployeeFinancialCustodyModel = {} as EmployeeFinancialCustodyModel;
  pagedResponseModel: PagedResponseDTO<EmployeeFinancialCustodyModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''
  };
  employeeStatusSelector: GeneralSelectorModel[] = [];
  employeeStatusId: number;
  lastJoinDate: any;
  FinancialCustodyTypeId: number;
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  public formGroup: FormGroup;
  public formErrors = {
    employeeFinancialCustodyId: '',
    employeeId: '',
    moneyAmount: '',
    executionDate: '',
    financialCustodyTypeId: '',
    notes: '',

  };
  selectedEmployeeId: number = null;
  alternativeEmployeeId: number = null;

  showAlternativeSelector = false;
  isUpdate: boolean = false;
  today: string;
  constructor(private modalService: NgbModal,
    private hrService: HrService,
    private sharedService: SharedService,
    private form: FormBuilder,
    private _FormService: FormService,
    private datePipe: DatePipe,
    private toaster: ToastrService,
    private lookupService: LookupService,
    private offcanvasService: NgbOffcanvas,) {
    this.today = this.datePipe.transform(new Date, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.getActiveEmployeesSelector();
  }
  getActiveEmployeesSelector() {
    this.hrService.GetActiveEmployeesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.employeeSelectorData = data;
    });
  }

  onSearch(employeeId: number) {
    this.pagedResponseModel.currentPage = 1;
    this.pagedResponseModel.results = [];
    this.selectedEmployeeId = employeeId;
    this.getFinancialCustodyByEmployeeId();
  }
  getFinancialCustodyTypesSelector() {
    this.lookupService.GetFinancialCustodyTypesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.financialCustodyTypeSelectorData = data;
    });
  }


  getFinancialCustodyByEmployeeId() {
    if (!this.checkEmployee())
      return;

    this.showLoader = true;
    this.hrService.GetFinancialCustodyByEmployeeId(this.selectedEmployeeId, this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  checkEmployee() {
    if (!this.selectedEmployeeId) {
      this.toaster.warning('يرجى اختيار الموظف أولا', 'تحذير');
      return false;
    }
    return true;
  }

  openNewSidePanel(content: any, financialCustodyModel: EmployeeFinancialCustodyModel = null) {
    if (!this.checkEmployee())
      return;
    this.isUpdate = false;
    this.buildForm();
    if (financialCustodyModel)
      this.fillEditForm(financialCustodyModel);

    this.formGroup.patchValue({ employeeId: this.selectedEmployeeId });
    this.offcanvasService.open(content, { panelClass: 'add-financialCustody-panel', position: 'end' });
  }

  buildForm() {
    this.formGroup = this.form.group({
      employeeFinancialCustodyId: [null],
      employeeId: [null],
      executionDate: [{ value: this.today, disabled: true }],
      moneyAmount: [null, [Validators.required, CustomValidators.regexPattern(RegexType.number)]],
      financialCustodyTypeId: [null, [Validators.required]],
      notes: [null],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  saveEmployeeFinancialCustody() {
    if (!this.validateForm()) {
      return;
    }
    // this.employeeFinancialCustodyModel = this.formGroup.value;
    this.employeeFinancialCustodyModel = this.formGroup.getRawValue();
    if (this.employeeFinancialCustodyModel?.employeeFinancialCustodyId)
      this.editEmployeeFinancialCustody();
    else
      this.addNewEmployeeFinancialCustody();
  }

  addNewEmployeeFinancialCustody() {
    this.showAddLoader = true;
    this.hrService.AddNewEmployeeFinancialCustody(this.selectedEmployeeId, this.employeeFinancialCustodyModel).subscribe(data => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.offcanvasService?.dismiss();
        this.getFinancialCustodyByEmployeeId();
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

  editEmployeeFinancialCustody() {
    this.showAddLoader = true;
    this.hrService.EditEmployeeFinancialCustody(this.selectedEmployeeId, this.employeeFinancialCustodyModel).subscribe(data => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.offcanvasService?.dismiss();
        this.getFinancialCustodyByEmployeeId();
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

  fillEditForm(financialCustodyModel: EmployeeFinancialCustodyModel) {
    this.isUpdate = true;
    this.formGroup.patchValue({
      employeeFinancialCustodyId: financialCustodyModel.employeeFinancialCustodyId,
      employeeId: this.selectedEmployeeId,
      executionDate: financialCustodyModel.executionDate,
      moneyAmount: financialCustodyModel.moneyAmount,
      financialCustodyTypeId: financialCustodyModel.financialCustodyTypeId,
      notes: financialCustodyModel.notes,
    });
  }

  openDeleteModal(content: any, employeeFinancialCustodyId: number) {
    this.selectedFinancialCustodyId = employeeFinancialCustodyId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }



  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.getFinancialCustodyByEmployeeId();
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getFinancialCustodyByEmployeeId();
  }


  deleteFinancialCustody() {
    this.showAddLoader = true;
    this.hrService.DeleteFinancialCustody(this.selectedFinancialCustodyId).subscribe(data => {

      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getFinancialCustodyByEmployeeId();
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
