import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { HrService } from '../../services/hr.service';
import { DatePipe } from '@angular/common';
import { FilterItem, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { EmployeeVacationModel } from '../../models/EmployeeVacationModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { CustomValidators } from 'src/app/components/Shared/services/custom-validators';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';

@Component({
  selector: 'app-hr-vacation',
  templateUrl: './hr-vacation.component.html',
  styleUrls: ['./hr-vacation.component.css']
})
export class HrVacationComponent implements OnInit {
  VacationData: any[] = [];
  employeeVacationsData: EmployeeVacationModel[] = [];
  employeeSelectorData: GeneralSelectorModel[] = [];
  vacationTypeSelectorData: GeneralSelectorModel[] = [];

  selectedVacationId: number;
  CategorySearch: any;
  CategoryName = 'قائمة الموظفين';
  SearchFilterModel: SearchFilterModel = {
    currentPage: 1,
    pageSize: 10,
    filterModel: { filterItems: [] }
  };
  employeeVacationModel: EmployeeVacationModel = {} as EmployeeVacationModel;
  pagedResponseModel: PagedResponseDTO<EmployeeVacationModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''
  };
  employeeStatusSelector: GeneralSelectorModel[] = [];
  employeeStatusId: number;
  lastJoinDate: any;
  VacationTypeId: number;
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  public formGroup: FormGroup;
  public formErrors = {
    vacationId: '',
    employeeId: '',
    isAlternativeAvailable: '',
    alternativeEmployeeId: '',
    vacationTypeId: '',
    fromDate: '',
    toDate: '',
    lastDayWork: '',
    notes: '',

  };
  selectedEmployeeId: number = null;
  alternativeEmployeeId: number = null;

  showAlternativeSelector = false;
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
    this.getEmployeesByVacationTypes(0);
    this.getVacationTypesSelector();
  }

  getVacationTypesSelector() {
    this.lookupService.GetVacationTypesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.vacationTypeSelectorData = data;
    });
  }

  getEmployeesByVacationTypes(vacationTypeId: number) {
    this.hrService.GetEmployeesByVacationTypes(vacationTypeId).subscribe((data: GeneralSelectorModel[]) => {
      this.employeeSelectorData = data;
    });
  }

  onVacationTypeSelectionChanged(vacationTypeId: number) {
    this.selectedEmployeeId = null;
    this.pagedResponseModel.results = [];
    this.pagedResponseModel.totalCount = 0;

    this.getVacationRequestsByType(vacationTypeId);
    this.getEmployeesByVacationTypes(vacationTypeId);
  }

  getVacationRequestsByType(vacationTypeId: number) {
    this.showLoader = true;
    this.VacationTypeId = vacationTypeId;
    this.hrService.GetVacationRequestsByType(vacationTypeId, this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  // getVacationsByEmployeeId() {
  //   if (!this.checkEmployee())
  //     return;

  //   this.showLoader = true;
  //   this.hrService.GetVacationsByEmployeeId(this.selectedEmployeeId, this.pagedResponseModel).subscribe(data => {
  //     this.pagedResponseModel.results = data.results;
  //     this.pagedResponseModel.totalCount = data.totalCount;

  //     this.showLoader = false;
  //   }, err => {
  //     this.showLoader = false;
  //   }, () => {
  //     this.showLoader = false;
  //   });
  // }

  checkEmployee() {
    if (!this.selectedEmployeeId || !this.VacationTypeId) {
      this.toaster.warning('يرجى اختيار الموظف ونوع الأجازة أولا', 'تحذير');
      return false;
    }
    return true;
  }

  showAlternativeEmployeeSelector() {
    if (this.showAlternativeSelector == true)
      this.showAlternativeSelector = false;
    else
      this.showAlternativeSelector = true;
  }

  openNewSidePanel(content: any, vacationModel: EmployeeVacationModel = null) {
    if (!this.checkEmployee())
      return;
    this.isUpdate = false;
    this.buildForm();
    if (vacationModel)
      this.fillEditForm(vacationModel);

    this.formGroup.patchValue({ employeeId: this.selectedEmployeeId });
    this.offcanvasService.open(content, { panelClass: 'add-vacation-panel', position: 'end' });
  }

  buildForm() {
    this.formGroup = this.form.group({
      vacationId: [null],
      employeeId: [null],
      isAlternativeAvailable: [false],
      alternativeEmployeeId: [null],
      fromDate: [null, [Validators.required, CustomValidators.dateGreaterThan(new Date(), 'لا يمكن إدخال تاريخ أجازة قديم')]], //[null, [Validators.required]],
      toDate: [null, [Validators.required, CustomValidators.dateGreaterThan(new Date(), 'لا يمكن إدخال تاريخ أجازة قديم')]], //[null, [Validators.required]],
      lastDayWork: [null, [Validators.required]],
      notes: [null],
    }, {
      validators: [CustomValidators.endDateGreaterThanStartDate('lastDayWork', 'fromDate', 'يجب ان يكون تاريخ بدء الاجازه بعد اخر يوم عمل'),
      CustomValidators.endDateGreaterThanStartDate('fromDate', 'toDate', 'يجب ان يكون تاريخ انهاء الاجازه بعد البدء')],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
    this.formGroup.get('isAlternativeAvailable').valueChanges.subscribe((alternativeEmployeeId) => {
    });
  }

  saveEmployeeVacation() {
    if (!this.validateForm()) {
      return;
    }
    this.employeeVacationModel = this.formGroup.value;
    this.employeeVacationModel.vacationTypeId = this.VacationTypeId;

    if (this.employeeVacationModel?.vacationId)
      this.editEmployeeVacation();
    else
      this.addNewEmployeeVacation();
  }

  addNewEmployeeVacation() {
    this.showAddLoader = true;
    this.hrService.AddNewEmployeeVacation(this.selectedEmployeeId, this.employeeVacationModel).subscribe(data => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.offcanvasService?.dismiss();
        //this.getVacationsByEmployeeId();
        this.getVacationRequestsByType(this.VacationTypeId);
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

  editEmployeeVacation() {
    this.showAddLoader = true;
    this.hrService.EditEmployeeVacation(this.selectedEmployeeId, this.employeeVacationModel).subscribe(data => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.offcanvasService?.dismiss();
        this.getVacationRequestsByType(this.VacationTypeId);
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

  fillEditForm(vacationModel: EmployeeVacationModel) {
    this.isUpdate = true;
    this.formGroup.patchValue({
      vacationId: vacationModel.vacationId,
      employeeId: this.selectedEmployeeId,
      isAlternativeAvailable: vacationModel.isAlternativeAvailable,
      alternativeEmployeeId: vacationModel.alternativeEmployeeId,
      vacationTypeId: vacationModel.vacationTypeId,
      fromDate: this.datePipe.transform(vacationModel.fromDate, 'yyyy-MM-dd'),
      toDate: this.datePipe.transform(vacationModel.toDate, 'yyyy-MM-dd'),
      lastDayWork: this.datePipe.transform(vacationModel.lastDayWork, 'yyyy-MM-dd'),
      notes: vacationModel.notes,
    });
  }

  openDeleteModal(content: any, vacationId: number) {
    this.selectedVacationId = vacationId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  openEditJoinDateModal(content: any, request: any) {
    this.showAddLoader = true;
    this.sharedService.GetEmployeeStatusSelector().subscribe((data: any[]) => {
      if (data) {
        this.employeeStatusSelector = data;
        this.employeeStatusId = request?.employeeStatusId;
        this.selectedEmployeeId = request?.employeeId;
      }
      else {
        this.toaster.error('Error in loading employee status');
      }
      this.showAddLoader = false;
    }, err => {
      this.showAddLoader = false;
    }, () => {
      this.showAddLoader = false;
    });
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.getVacationRequestsByType(this.VacationTypeId);
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getVacationRequestsByType(this.VacationTypeId);
  }


  deleteVacation() {
    this.showAddLoader = true;
    this.hrService.DeleteVacation(this.selectedVacationId).subscribe(data => {

      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getVacationRequestsByType(this.VacationTypeId);
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

  updateEmployeeLastJoinDate(){
    this.showAddLoader = true;
    this.hrService.UpdateEmployeeLastJoinDate(this.selectedEmployeeId, this.lastJoinDate).subscribe(data => {
      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getVacationRequestsByType(this.VacationTypeId);
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
