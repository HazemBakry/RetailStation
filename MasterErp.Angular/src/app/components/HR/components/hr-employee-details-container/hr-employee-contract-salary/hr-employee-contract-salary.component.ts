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
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { EmployeeContractDetailsModel, EmployeeContractModel } from '../../../models/Employee/EmployeeContractModel';
import { EmployeeService } from '../../../services/employee.service';
import { HrService } from '../../../services/hr.service';

@Component({
  selector: 'app-hr-employee-contract-salary',
  templateUrl: './hr-employee-contract-salary.component.html',
  styleUrls: ['./hr-employee-contract-salary.component.css']
})
export class HrEmployeeContractSalaryComponent implements OnInit {
  @Input() employeeId: number;
  contractId: number;
  employeeContractInfoModel: EmployeeContractDetailsModel = {} as EmployeeContractDetailsModel;
  isUpdate: boolean = false;

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  IsMealAdded: boolean = false;
  public formGroup: FormGroup;



  constructor(private acRoute: ActivatedRoute, private hrService: HrService, private modalService: NgbModal, private employeeService: EmployeeService, private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

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
        this.contractId = this.employeeContractInfoModel?.contractId;
        if (this.employeeContractInfoModel?.contractDetailId)
          this.initNewForm(this.employeeContractInfoModel);
      }

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });


  }

  initNewForm(employeeContractInfoModel: EmployeeContractDetailsModel = null) {

    this.isUpdate = false;
    this.buildForm();
    if (employeeContractInfoModel)
      this.fillEditForm(employeeContractInfoModel);

    // this.formGroup.patchValue({employeeId:this.selectedEmployeeId});

  }
  buildForm() {
    this.formGroup = this.form.group({
      contractId: [this.contractId],
      employeeId: [this.employeeId],
      contractDetailId: [null],
      basicSalary: [null, [Validators.required, CustomValidators.regexPattern(RegexType.number)]],
      extraSalary: [null],
      transportation: [null],
      housingAllowance: [null],
      mobileAllowance: [null],
      workNature: [null],
      mealAllowance: [null],
      isMealAdded: [null],
      other: [null]
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

    if (this.employeeId && this.contractId)
      this.saveData();
    else
      this.toaster.warning('please add basic info and contract first', 'Warning');
  }


  saveData() {
    this.showAddLoader = true;
    this.employeeService.SaveEmployeeContractDetailsData(this.employeeId, this.contractId, this.employeeContractInfoModel).subscribe((data: ActionsResponseModel) => {
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


  fillEditForm(employeeContractInfoModel: EmployeeContractDetailsModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      contractId: employeeContractInfoModel.contractId,
      contractDetailId: employeeContractInfoModel.contractDetailId,
      employeeId: employeeContractInfoModel.employeeId,
      basicSalary: employeeContractInfoModel.basicSalary,
      extraSalary: employeeContractInfoModel.extraSalary,
      transportation: employeeContractInfoModel.transportation,
      housingAllowance: employeeContractInfoModel.housingAllowance,
      mobileAllowance: employeeContractInfoModel.mobileAllowance,
      workNature: employeeContractInfoModel.workNature,
      mealAllowance: employeeContractInfoModel.mealAllowance,
      other: employeeContractInfoModel.other,
      isMealAdded: employeeContractInfoModel.isMealAdded
    });
  }




  public formErrors = {
    contractId: '',
    contractDetailId: '',
    employeeId: '',
    basicSalary: '',
  };



}

