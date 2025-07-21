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
import { EmployeeVerificationModel } from '../../../models/Employee/EmployeeVerificationModel';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { HrService } from '../../../services/hr.service';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';


@Component({
  selector: 'app-hr-employee-verification-info',
  templateUrl: './hr-employee-verification-info.component.html',
  styleUrls: ['./hr-employee-verification-info.component.css']
})
export class HrEmployeeVerificationInfoComponent implements OnInit {
  @Input() employeeId: number;
  iqamaJobselectorData: FormDropdownModel[] = [];
  employeeVerificationInfoModel: EmployeeVerificationModel = {} as EmployeeVerificationModel;
  isUpdate: boolean = false;
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  public formGroup: FormGroup;
  iqamaIssuePlacesSelectorData: FormDropdownModel[] = [];
  banksSelectorData: FormDropdownModel[] = [];

  constructor(private acRoute: ActivatedRoute,
    private hrService: HrService,
    private employeeService: EmployeeService,
    private sharedService: SharedService,
    private form: FormBuilder,
    private _FormService: FormService,
    private datePipe: DatePipe,
    private toaster: ToastrService,
    private lookupService: LookupService
  ) { }

  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.EmployeeId) {
        this.employeeId = params.EmployeeId;
        this.getEmployeeVerificationInfo();
      }
    })

    this.initNewForm();
    this.loadSelectors();
  }

  getEmployeeVerificationInfo() {
    this.showLoader = true;
    this.employeeService.GetEmployeeVerificationInfoById(this.employeeId).subscribe((data: EmployeeVerificationModel) => {
      if (data) {
        this.employeeVerificationInfoModel = data;
        this.initNewForm(this.employeeVerificationInfoModel);
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  initNewForm(employeeVerificationInfoModel: EmployeeVerificationModel = null) {
    this.isUpdate = false;
    this.buildForm();
    if (employeeVerificationInfoModel)
      this.fillEditForm(employeeVerificationInfoModel);
  }

  buildForm() {
    this.formGroup = this.form.group({
      employeeVerificationId: [null],
      employeeId: [null],

      bankId: [null],
      bankAccountNumber: [null, [CustomValidators.regexPattern(RegexType.number)]],
      iqamaNumber: [null, [Validators.required, CustomValidators.regexPattern(RegexType.number)]],
      iqamaIssuePlaceId: [null],
      iqamaIssueDate: [null],
      iqamaExpireDate: [null],

      drivingLicenseNumber: [null, [CustomValidators.regexPattern(RegexType.number)]],
      drivingLicenseIssueDate: [null],
      drivingLicenseExpireDate: [null],
      vehicleId: [null],
      vehicleNumber: [null],
      vehicleCode: [null],

    },
      {
        validators: [
          CustomValidators.endDateGreaterThanStartDate('iqamaIssueDate', 'iqamaExpireDate', 'يجب ان يكون تاريخ الاصدار قبل الانتهاء '),
          CustomValidators.endDateGreaterThanStartDate('drivingLicenseIssueDate', 'drivingLicenseExpireDate', 'يجب ان يكون تاريخ الاصدار قبل الانتهاء '),
        ],
      });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  saveEmployeeVerificationInfo() {
    if (!this.validateForm()) {
      return;
    }
    this.employeeVerificationInfoModel = this.formGroup.value;

    if (this.employeeId)
      this.saveData();
    else
      this.toaster.warning('please add basic info first', 'Warning');
  }


  saveData() {

    this.showAddLoader = true;
    this.employeeService.SaveEmployeeVerificationData(this.employeeId, this.employeeVerificationInfoModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.initNewForm();
        this.toaster.success(data?.message);
        this.getEmployeeVerificationInfo();
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
    this.sharedService.GetIqamaIssuePlacesSelector().subscribe((data: FormDropdownModel[]) => {
      this.iqamaIssuePlacesSelectorData = data;
    });
    this.sharedService.GetBanksSelector().subscribe((data: FormDropdownModel[]) => {
      this.banksSelectorData = data;
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


  fillEditForm(employeeVerificationInfoModel: EmployeeVerificationModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({

      employeeVerificationId: employeeVerificationInfoModel.employeeVerificationId,
      employeeId: this.employeeId,
      bankId: employeeVerificationInfoModel.bankId,
      bankAccountNumber: employeeVerificationInfoModel.bankAccountNumber,
      iqamaNumber: employeeVerificationInfoModel.iqamaNumber,
      iqamaIssuePlaceId: employeeVerificationInfoModel.iqamaIssuePlaceId,
      iqamaIssueDate: this.datePipe.transform(employeeVerificationInfoModel.iqamaIssueDate, 'yyyy-MM-dd'),
      iqamaExpireDate: this.datePipe.transform(employeeVerificationInfoModel.iqamaExpireDate, 'yyyy-MM-dd'),

      drivingLicenseNumber: employeeVerificationInfoModel.drivingLicenseNumber,
      drivingLicenseIssueDate: this.datePipe.transform(employeeVerificationInfoModel.drivingLicenseIssueDate, 'yyyy-MM-dd'),
      drivingLicenseExpireDate: this.datePipe.transform(employeeVerificationInfoModel.drivingLicenseExpireDate, 'yyyy-MM-dd'),
      vehicleId: employeeVerificationInfoModel.vehicleId,
      vehicleNumber: employeeVerificationInfoModel.vehicleNumber,
      vehicleCode: employeeVerificationInfoModel.vehicleCode,

    });
  }




  public formErrors = {
    employeeVerificationId: '',
    employeeId: '',
    iqamaNumber: '',
    bankId: '',
    bankAccountNumber: '',
    iqamaIssueDate: '',
    iqamaExpireDate: '',
    iqamaIssuePlaceId: '',
    drivingLicenseNumber: '',
    drivingLicenseIssueDate: '',
    drivingLicenseExpireDate: '',
    vehicleId: '',
    vehicleNumber: '',
    vehicleCode: '',
  };



}

