import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { HrService } from '../../services/hr.service';
import { DatePipe } from '@angular/common';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { EmployeeOverTimeModel } from '../../models/EmployeeOverTimeModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';
import { EmployeeContractModel } from '../../models/Employee/EmployeeContractModel';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';

@Component({
  selector: 'app-hr-over-time',
  templateUrl: './hr-over-time.component.html',
  styleUrls: ['./hr-over-time.component.css']
})
export class HrOverTimeComponent implements OnInit {
  VacationData: any[] = [];

  employeeSelectorData: GeneralSelectorModel[] = [];
  overtimeRatioSelectorData: GeneralSelectorModel[] = [
    { value: 1, name: '1' },
    { value: 1.25, name: '1.25' },
    { value: 1.5, name: '1.5' },
    { value: 1.75, name: '1.75' },
    { value: 2, name: '2' }
  ];

  selectedOverTimeId: number;
  noHours: number;
  employeeOverTimeModel: EmployeeOverTimeModel = {} as EmployeeOverTimeModel;
  employeeOverTimeResponse: PagedResponseDTO<EmployeeOverTimeModel[]> = {
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
    overTimeId: '',
    employeeId: '',
    executionDate: '',
    noHours: '',
    requestDate: '',
    overtimeRatio: '',
    moneyAmount: '',
    notes: '',
    timeFrom: '',
    timeTo: '',
  };

  selectedEmployeeId: number = null;
  isUpdate: boolean = false;
  employeeContract: EmployeeContractModel;

  constructor(private modalService: NgbModal, private hrService: HrService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.getActiveEmployeesSelector();
  }
  employeeChanged(employeeId: number) {
    if (employeeId)
      this.getEmployeeContractSalary();
  }
  getOverTimeByEmployeeId() {
    if (!this.checkEmployee())
      return;

    this.showLoader = true;
    this.hrService.GetOverTimeByEmployeeId(this.selectedEmployeeId, this.employeeOverTimeResponse).subscribe(data => {
      this.employeeOverTimeResponse.results = data.results;
      this.employeeOverTimeResponse.totalCount = data.totalCount;

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

  getEmployeeContractSalary() {
    this.hrService.GetEmployeeContractDetails(this.selectedEmployeeId).subscribe(data => {
      this.employeeContract = data;
    });
  }

  openNewSidePanel(content: any, overTimeModel: EmployeeOverTimeModel = null) {
    if (!this.checkEmployee())
      return;
    this.isUpdate = false;
    this.buildForm();
    if (overTimeModel)
      this.fillEditForm(overTimeModel);

    this.formGroup.patchValue({ employeeId: this.selectedEmployeeId });

    this.offcanvasService.open(content, { panelClass: 'add-new-panel', position: 'end' });
  }

  buildForm() {
    this.formGroup = this.form.group({
      overTimeId: [null],
      employeeId: [null],
      executionDate: [null, [Validators.required]],
      // noHours: [{ value: null, disabled: true }, [Validators.required, CustomValidators.regexPattern(RegexType.number)]],
      noHours: [null, [Validators.required, CustomValidators.regexPattern(RegexType.number)]],
      requestDate: [null],
      // moneyAmount: [{ value: null, disabled: true }, [Validators.required, CustomValidators.regexPattern(RegexType.number),]],
      overtimeRatio: [1, [Validators.required]],
      moneyAmount: [null, [Validators.required, CustomValidators.regexPattern(RegexType.number),]],
      notes: [null],
      timeFrom: [null],
      timeTo: [null],

    });

    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });

    this.formGroup.get('timeFrom').valueChanges.subscribe(() => {
      this.calculateNoHours();
    });

    this.formGroup.get('timeTo').valueChanges.subscribe(() => {
      this.calculateNoHours();
    });
    this.formGroup.get('overtimeRatio').valueChanges.subscribe(() => {
      this.calculateNoHours();
    });

  }

  saveEmployeeOverTime() {
    if (!this.validateForm()) {
      return;
    }
    this.employeeOverTimeModel = this.formGroup.value;
    if (this.employeeOverTimeModel?.overTimeId)
      this.editEmployeeOverTime();
    else
      this.addNewEmployeeOverTime();
  }

  addNewEmployeeOverTime() {
    this.showAddLoader = true;
    this.hrService.AddNewEmployeeOverTime(this.selectedEmployeeId, this.employeeOverTimeModel).subscribe(data => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.offcanvasService?.dismiss();
        this.getOverTimeByEmployeeId();
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

  editEmployeeOverTime() {
    this.showAddLoader = true;
    this.hrService.EditEmployeeOverTime(this.selectedEmployeeId, this.employeeOverTimeModel).subscribe(data => {

      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.offcanvasService?.dismiss();
        this.getOverTimeByEmployeeId();
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

  fillEditForm(overTimeModel: EmployeeOverTimeModel) {
    this.isUpdate = true;
    this.formGroup.patchValue({
      overTimeId: overTimeModel.overTimeId,
      employeeId: this.selectedEmployeeId,
      executionDate: this.datePipe.transform(overTimeModel.executionDate, 'yyyy-MM-dd'),
      requestDate: this.datePipe.transform(overTimeModel.requestDate, 'yyyy-MM-dd'),
      noHours: overTimeModel.noHours,
      overtimeRatio: overTimeModel.overtimeRatio,
      moneyAmount: overTimeModel.moneyAmount,
      notes: overTimeModel.notes
    });
  }

  openDeleteModal(content: any, overTimeId: number) {
    this.selectedOverTimeId = overTimeId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  getActiveEmployeesSelector() {
    this.hrService.GetActiveEmployeesSelector().subscribe((data: FormDropdownModel[]) => {
      this.employeeSelectorData = data;
    });
  }

  filterChecked(filterItems: FilterItem[]) {
    this.employeeOverTimeResponse.filterList = filterItems;
    this.getOverTimeByEmployeeId();
  }

  pageChanged(obj: any) {
    this.employeeOverTimeResponse.currentPage = obj.page;
    this.getOverTimeByEmployeeId();
  }

  deleteEmployeeOverTime() {
    this.showAddLoader = true;
    this.hrService.DeleteEmployeeOverTime(this.selectedOverTimeId).subscribe(data => {

      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getOverTimeByEmployeeId();
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

  getHoursDifference(): number {

    const start = this.formGroup.get('timeFrom').value;
    const end = this.formGroup.get('timeTo').value;

    if (start && end) {

      const [startHours, startMinutes] = start.split(':').map(Number);
      const [endHours, endMinutes] = end.split(':').map(Number);

      const startDate = new Date();
      startDate.setHours(startHours, startMinutes, 0, 0);

      const endDate = new Date();
      endDate.setHours(endHours, endMinutes, 0, 0);

      const diffMs = Math.abs(endDate.getTime() - startDate.getTime());
      const diffHours = diffMs / (1000 * 60 * 60);

      return Math.floor(diffHours);
    }
  }

  // Example usage
  // const minHours = Math.min(
  //   this.getHoursDifference('13:00', '16:00'),
  //   this.getHoursDifference('10:30', '11:15')
  // );




  calculateNoHours() {
    const start = this.formGroup.get('timeFrom').value;
    const end = this.formGroup.get('timeTo').value;
    const transferRation = this.formGroup.get('overtimeRatio').value ?? 1;

    if (start && end) {

      const [startHours, startMinutes] = start.split(':').map(Number);
      const [endHours, endMinutes] = end.split(':').map(Number);

      const startDate = new Date();
      startDate.setHours(startHours, startMinutes, 0, 0);

      const endDate = new Date();
      endDate.setHours(endHours, endMinutes, 0, 0);

      const diffMs = Math.abs(endDate.getTime() - startDate.getTime());
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      // let roundedDiffInHours = 0;
      if (diffHours >= 0) {
        //   const diffInHours = diffInMinutes / 60;
        //   roundedDiffInHours = Math.round(diffInHours * 10) / 10; // Round to one decimal place
        this.formGroup.get('noHours').setValue(diffHours);
      } else {
        this.formGroup.get('noHours').setValue(null);
      }

      let salaryPerHour = 0;
      if (this.employeeContract && this.employeeContract?.basicSalary)
        salaryPerHour = parseFloat((this.employeeContract?.basicSalary / 30).toFixed(2));

      const val = (diffHours * salaryPerHour * transferRation).toFixed(2);
      this.formGroup.get('moneyAmount').setValue(val);
    }

  }
}