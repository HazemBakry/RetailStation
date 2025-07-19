import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { EmployeeContractModel } from '../../../models/Employee/EmployeeContractModel';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { HrService } from '../../../services/hr.service';


@Component({
  selector: 'app-hr-employee-contract-info',
  templateUrl: './hr-employee-contract-info.component.html',
  styleUrls: ['./hr-employee-contract-info.component.css']
})
export class HrEmployeeContractInfoComponent implements OnInit {
  @Input() employeeId: number;
  employeeContractInfoModel: EmployeeContractModel = {} as EmployeeContractModel;

  isUpdate: boolean = false;
  showLoader: boolean = false;
  showAddLoader: boolean = false;

  public formGroup: FormGroup;
  public formErrors = {
    contractId: '',
    employeeId: '',
    startDate: '',
    endDate: '',
    vacationPeriodDays: '',
    contractPeriodYears: '',
    isGossi: '',
    vacationDate: '',
    joinDate: '',
    lastJoinDate: ''
  };

  constructor(private acRoute: ActivatedRoute,
    private hrService: HrService,
    private modalService: NgbModal,
    private employeeService: EmployeeService,
    private sharedService: SharedService,
    private form: FormBuilder,
    private _FormService: FormService,
    private datePipe: DatePipe,
    private toaster: ToastrService,
    private offcanvasService: NgbOffcanvas) {
  }

  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.EmployeeId) {
        this.employeeId = params.EmployeeId;
        this.getEmployeeContractInfo();
      }
    })
    this.initNewForm();
    this.loadSelectors();
  }

  getEmployeeContractInfo() {
    this.showLoader = true;
    this.employeeService.GetEmployeeContractInfoById(this.employeeId).subscribe((data: EmployeeContractModel) => {
      if (data) {
        this.employeeContractInfoModel = data;
        this.initNewForm(this.employeeContractInfoModel);
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  initNewForm(employeeContractInfoModel: EmployeeContractModel = null) {
    this.isUpdate = false;
    this.buildForm();
    if (employeeContractInfoModel)
      this.fillEditForm(employeeContractInfoModel);

    // this.formGroup.patchValue({employeeId:this.selectedEmployeeId});
  }

  buildForm() {
    this.formGroup = this.form.group({
      contractId: [null],
      employeeId: [null],
      startDate: [null, [Validators.required]],
      joinDate: [null],
      lastJoinDate: [null],
      endDate: [null, [Validators.required]],
      vacationPeriodDays: [null, [CustomValidators.regexPattern(RegexType.number)]],
      contractPeriodYears: [null, [CustomValidators.regexPattern(RegexType.number)]],
      isGossi: [false],
      vacationDate: [null],
    },
      {
        validators: [
          CustomValidators.endDateGreaterThanStartDate('startDate', 'endDate', 'يجب ان يكون تاريخ اصدار العقد قبل الانتهاء '),
        ],
      });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  saveEmployeeContractInfo() {
    if (!this.validateForm()) {
      return;
    }
    this.employeeContractInfoModel = this.formGroup.value;
    if (this.employeeId)
      this.saveData();
    else
      this.toaster.warning('please add basic info first', 'Warning');
  }

  saveData() {
    this.showAddLoader = true;
    this.employeeService.SaveEmployeeContractData(this.employeeId, this.employeeContractInfoModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.initNewForm();
        this.toaster.success(data?.message);
        this.getEmployeeContractInfo();
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
  loadSelectors() {

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

  fillEditForm(employeeContractInfoModel: EmployeeContractModel) {
    this.isUpdate = true;
    this.formGroup.patchValue({
      contractId: employeeContractInfoModel.contractId,
      employeeId: employeeContractInfoModel.employeeId,
      startDate: this.datePipe.transform(employeeContractInfoModel.startDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(employeeContractInfoModel.endDate, 'yyyy-MM-dd'),
      joinDate: this.datePipe.transform(employeeContractInfoModel.joinDate, 'yyyy-MM-dd'),
      lastJoinDate: this.datePipe.transform(employeeContractInfoModel.lastJoinDate, 'yyyy-MM-dd'),
      vacationPeriodDays: employeeContractInfoModel.vacationPeriodDays,
      contractPeriodYears: employeeContractInfoModel.contractPeriodYears,
      isGossi: employeeContractInfoModel.isGossi,
      vacationDate: this.datePipe.transform(employeeContractInfoModel.vacationDate, 'yyyy-MM-dd'),
    });
  }





}

