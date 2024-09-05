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
import { ActionsResponseModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';
import { HrService } from '../../../services/hr.service';


@Component({
  selector: 'app-hr-employee-verification-info',
  templateUrl: './hr-employee-verification-info.component.html',
  styleUrls: ['./hr-employee-verification-info.component.css']
})
export class HrEmployeeVerificationInfoComponent implements OnInit {
  @Input() employeeId: number;
  iqamaJobselectorData: FormDropdownModel[]= [];
  employeeVerificationInfoModel: EmployeeVerificationModel = {} as EmployeeVerificationModel;
  isUpdate: boolean = false;
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  public formGroup: FormGroup;
  iqamaIssuePlacesSelectorData: FormDropdownModel[] = [];

  constructor(private acRoute: ActivatedRoute, private hrService: HrService, private modalService: NgbModal, private employeeService: EmployeeService, private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

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
      borderEntryNumber: [null, [Validators.required]],
      passportNumber: [null, [Validators.required, CustomValidators.regexPattern(RegexType.number)]],
      borderEntryDate: [null, [Validators.required]],
      arrivalPort: [null, [Validators.required]],
      visaNumber: [null, [Validators.required, CustomValidators.regexPattern(RegexType.number)]],
      visaIssueDate: [null, [Validators.required]],
      passportIssuanceDate: [null, [Validators.required]],
      passportExpireDate: [null, [Validators.required]],
      passportIssuancePlace: [null, [Validators.required]],
    },
      {
        validators: [
          CustomValidators.endDateGreaterThanStartDate('passportIssuanceDate', 'passportExpireDate', 'يجب ان يكون تاريخ الاصدار قبل الانتهاء '),
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
    // this.sharedService.GetIqamaIssuePlacesSelector().subscribe((data: FormDropdownModel[]) => {
    //   this.iqamaIssuePlacesSelectorData = data;
    // });
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
      borderEntryNumber: employeeVerificationInfoModel.borderEntryNumber,
      passportNumber: employeeVerificationInfoModel.passportNumber,
      borderEntryDate: this.datePipe.transform(employeeVerificationInfoModel.borderEntryDate, 'yyyy-MM-dd'),
      arrivalPort: employeeVerificationInfoModel.arrivalPort,
      visaNumber: employeeVerificationInfoModel.visaNumber,
      visaIssueDate: this.datePipe.transform(employeeVerificationInfoModel.visaIssueDate, 'yyyy-MM-dd'),
      passportIssuanceDate: this.datePipe.transform(employeeVerificationInfoModel.passportIssuanceDate, 'yyyy-MM-dd'),
      passportExpireDate: this.datePipe.transform(employeeVerificationInfoModel.passportExpireDate, 'yyyy-MM-dd'),
      passportIssuancePlace: employeeVerificationInfoModel.passportIssuancePlace,
    });
  }




  public formErrors = {
    employeeVerificationId: '',
    employeeId: '',
    borderEntryNumber: '',
    passportNumber: '',
    borderEntryDate: '',
    arrivalPort: '',
    visaNumber: '',
    visaIssueDate: '',
    iqamaNumber: '',
    iqamaJobId: '',
    iqamaIssueDate: '',
    iqamaExpireDate: '',
    iqamaIssuePlaceId: '',
  };



}

