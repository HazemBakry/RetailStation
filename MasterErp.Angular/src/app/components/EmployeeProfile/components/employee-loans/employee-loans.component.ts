import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { FilterItem, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { EmployeeLoanModel } from 'src/app/components/HR/models/EmployeeLoanModel';
import { EmployeeProfileService } from '../../services/employee-profile.service';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';


@Component({
  selector: 'app-employee-loans',
  templateUrl: './employee-loans.component.html',
  styleUrls: ['./employee-loans.component.css']
})
export class EmployeeLoansComponent implements OnInit {
  LoanData: any[] = [];
  employeeLoansData: EmployeeLoanModel[] = [];
  employeeSelectorData: FormDropdownModel[] = [];
  loanTypesSelectorData: FormDropdownModel[] = [];

  selectedLoanId: number;
  CategorySearch: any;
  CategoryName = 'قائمة الموظفين';
  SearchFilterModel: SearchFilterModel = {
    currentPage: 1,
    pageSize: 25,
    filterModel: { filterItems: [] }
  };
  employeeLoanModel: EmployeeLoanModel = {} as EmployeeLoanModel;
  loanResponse: PagedResponseDTO<EmployeeLoanModel[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: ''

  };
  showLoader: boolean = false;
  detailsView: boolean = false;
  showAddLoader: boolean = false;

  public formGroup: FormGroup;

  public formErrors = {
    loanId: '',
    employeeId: '',
    paymentFromDate: '',
    loanTypeId: '',
    loanAmount: '',
    paymentAmount: '',
    isApproved: '',
    notes: ''
  };
  selectedEmployeeId: number = null;
  isUpdate: boolean = false;
  constructor(private modalService: NgbModal,
    private employeeProfile: EmployeeProfileService,
    private sharedService: SharedService,
    private form: FormBuilder,
    private _FormService: FormService,
    private datePipe: DatePipe,
    private toaster: ToastrService,
    private lookupService: LookupService,
    private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.initNewLoanForm();
    this.getLoanTypesSelector();
  }

  toggleDetails(loanModel: EmployeeLoanModel = null) {
    this.loanResponse.results = [];
    this.detailsView = !this.detailsView;
    if (this.detailsView)
      this.getLoans();

    this.initNewLoanForm(loanModel);
  }
  getLoans() {

    this.showLoader = true;
    this.employeeProfile.GetLoans(this.loanResponse).subscribe(data => {
      this.loanResponse.results = data.results;
      this.loanResponse.totalCount = data.totalCount;

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });


  }

  initNewLoanForm(loanModel: EmployeeLoanModel = null) {

    this.isUpdate = false;
    this.buildForm();
    if (loanModel)
      this.fillEditForm(loanModel);

    // this.formGroup.patchValue({employeeId:this.selectedEmployeeId});

  }
  buildForm() {
    this.formGroup = this.form.group({
      loanId: [null],
      employeeId: [null],
      loanTypeId: [null, [Validators.required]],
      loanAmount: [null, [Validators.required, CustomValidators.regexPattern(RegexType.number)]],
      paymentAmount: [null, [Validators.required, CustomValidators.regexPattern(RegexType.number)]],
      isApproved: [null],
      paymentFromDate: [null, [Validators.required, CustomValidators.dateGreaterThan(new Date(), 'ادخل تاربخ اكبر')]],
      notes: [null],

    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
  }

  saveLoan() {
    if (!this.validateForm()) {
      return;
    }
    this.employeeLoanModel = this.formGroup.value;

    if (this.employeeLoanModel?.loanId)
      this.editLoan();
    else
      this.addNewLoan();
  }

  addNewLoan() {
    this.showAddLoader = true;
    this.employeeProfile.AddNewLoan(this.employeeLoanModel).subscribe(data => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        // this.offcanvasService?.dismiss();
        // this.getLoans();
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

  editLoan() {

    this.showAddLoader = true;
    this.employeeProfile.EditLoan(this.employeeLoanModel).subscribe(data => {

      if (data?.isSuccess) {
        this.formGroup?.reset();
        // this.offcanvasService?.dismiss();
        // this.getLoans();
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
  getLoanTypesSelector() {
    this.lookupService.GetLoanTypesSelector().subscribe((data: FormDropdownModel[]) => {
      this.loanTypesSelectorData = data;
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


  fillEditForm(loanModel: EmployeeLoanModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      loanId: loanModel.loanId,
      loanTypeId: loanModel.loanTypeId,
      loanAmount: loanModel.loanAmount,
      paymentAmount: loanModel.paymentAmount,
      isApproved: loanModel.isApproved,
      employeeId: this.selectedEmployeeId,
      paymentFromDate: this.datePipe.transform(loanModel.paymentFromDate, 'yyyy-MM-dd'),
      notes: loanModel.notes
    });
  }


  openDeleteModal(content: any, loanId: number) {
    this.selectedLoanId = loanId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }


  filterChecked(filterItems: FilterItem[]) {
    this.loanResponse.filterList = filterItems;
    this.getLoans();
  }

  pageChanged(obj: any) {
    this.loanResponse.currentPage = obj.page;
    this.getLoans();
  }


  deleteLoan() {
    this.showAddLoader = true;
    this.employeeProfile.DeleteLoan(this.selectedLoanId).subscribe(data => {

      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getLoans();
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
