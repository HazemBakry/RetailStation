import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { CustomValidators } from 'src/app/components/Shared/services/custom-validators';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { EmployeeModel } from '../../../models/Employee/EmployeeModel';
import { ActionsResponseModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';
import { HrService } from '../../../services/hr.service';


@Component({
  selector: 'app-hr-employee-basic-info',
  templateUrl: './hr-employee-basic-info.component.html',
  styleUrls: ['./hr-employee-basic-info.component.css']
})
export class HrEmployeeBasicInfoComponent implements OnInit {
  @Input() employeeId: number;
  employeeBasicInfoModel: EmployeeModel = {} as EmployeeModel;
  isUpdate: boolean = false;

  employeesSelectorData: FormDropdownModel[] = [];
  jobsSelectorData: FormDropdownModel[] = [];
  workStatusSelectorData: FormDropdownModel[] = [];
  branchSelectorData: FormDropdownModel[] = [];
  banksSelectorData: FormDropdownModel[]= [];
  nationalitiesSelectorData: FormDropdownModel[]= [];
  iqamaIssuePlacesSelectorData: FormDropdownModel[]= [];
  iqamaJobselectorData: FormDropdownModel[]= [];
  vehiclesSelectorData: FormDropdownModel[]= [];
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  employeeImageFile: File;
  formData: FormData = new FormData();
  public formGroup: FormGroup;



  constructor(private acRoute: ActivatedRoute,private router:Router, private hrService: HrService, private modalService: NgbModal, private employeeService: EmployeeService, private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.EmployeeId) {
        this.employeeId = params.EmployeeId;
        this.getEmployeeBasicInfo();
      }
    })


    this.initNewForm();
    this.loadSelectors();
  }


  getEmployeeBasicInfo() {
    this.showLoader = true;
    this.employeeService.GetEmployeeBasicInfoById(this.employeeId).subscribe((data: EmployeeModel) => {
      if (data) {
        this.employeeBasicInfoModel = data;
        this.initNewForm(this.employeeBasicInfoModel);
      }

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });


  }

  initNewForm(employeeBasicInfoModel: EmployeeModel = null) {

    this.isUpdate = false;
    this.buildForm();
    if (employeeBasicInfoModel)
      this.fillEditForm(employeeBasicInfoModel);

    // this.formGroup.patchValue({employeeId:this.selectedEmployeeId});

  }
  buildForm() {
    this.formGroup = this.form.group({
      employeeId: [null],
      managerId: [null],
      jobId: [null, [Validators.required]],
      branchId: [null, [Validators.required]],
      statusId: [null],
      firstNameAR: [null, [Validators.required]],
      fatherNameAR: [null, [Validators.required]],
      grandNameAR: [null, [Validators.required]],
      lastNameAR: [null, [Validators.required]],
      firstNameEN: [null, [Validators.required]],
      fatherNameEN: [null, [Validators.required]],
      grandNameEN: [null, [Validators.required]],
      lastNameEN: [null, [Validators.required]],
      bankId: [null, [Validators.required]],
      bankAccountNumber: [null, [Validators.required]],
      birthDate: [null, [Validators.required]],
      birthPlace: [null, [Validators.required]],
      nationalityId: [null, [Validators.required]],
      sponsorId: [null, [Validators.required]],
      iqamaNumber: [null, [Validators.required]],
      iqamaJobId: [null, [Validators.required]],
      iqamaIssuePlaceId: [null, [Validators.required]],
      iqamaIssueDate: [null, [Validators.required]],
      iqamaExpireDate: [null, [Validators.required]],
      iqamaExpireDateHijri: [null],
      iqamaIssueDateHijri: [null],
      iqamaJobDescription: [null],
      religion: [null, [Validators.required]],
      address: [null, [Validators.required]],
      imageFile: [null],
      attachmentFile: [null],

      drivingLicenseNumber: [null],
      drivingLicenseIssueDate: [null],
      drivingLicenseIssueDateHijri: [null],
      drivingLicenseExpireDate: [null],
      drivingLicenseExpireDateHijri: [null],
      vehicleId: [null],

      // loanTypeId: [null, [Validators.required]],
      // loanAmount: [null, [Validators.required, CustomValidators.regexPattern(/^[0-9]+(\.[0-9])?$/, 'ادخل ارقام فقط')]],
      // paymentAmount: [null, [Validators.required, CustomValidators.regexPattern(/^[0-9]+(\.[0-9])?$/, 'ادخل ارقام فقط')]],
      // paymentFromDate: [null, [Validators.required, CustomValidators.dateGreaterThan(new Date(), 'ادخل تاربخ اكبر')]],

    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
  }

  saveEmployeeBasicInfo() {
    if (!this.validateForm()) {
      return;
    }
    this.employeeBasicInfoModel = this.formGroup.value;

    this.formData = new FormData();
    if (this.employeeImageFile !=null) {
      this.formData.append('imageFile', this.employeeImageFile);
    }


    Object.keys(this.formGroup.value).forEach(key => {
      if (key != 'imageFile'&& this.formGroup.value[key])
        this.formData.append(key, this.formGroup.value[key]);
    });
    if (this.employeeId)
      this.editEmployeeBasicInfo();
    else
      this.addNewEmployee();
  }

  addNewEmployee() {

    this.showAddLoader = true;
    this.employeeService.CreateNewEmployee(this.formData).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.toaster.success(data?.message);
        this.navigateToAddedEmployee(data?.id);

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

  editEmployeeBasicInfo() {

    this.showAddLoader = true;
    this.employeeService.EditEmployee(this.employeeId, this.formData).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        // this.initNewForm();
        this.toaster.success(data?.message);
        this.getEmployeeBasicInfo();
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
    this.hrService.GetActiveEmployeesSelector().subscribe((data :FormDropdownModel[])=> {
      this.employeesSelectorData = data;
    });
    this.sharedService.GetBranchesSelector().subscribe((data: FormDropdownModel[]) => {
      this.branchSelectorData = data;
    });
    this.hrService.GetWorkStatusSelector().subscribe((data: FormDropdownModel[]) => {
      this.workStatusSelectorData = data;
    });
    this.hrService.GetJobsSelector().subscribe((data: FormDropdownModel[]) => {
      this.jobsSelectorData = data;
    });
    this.sharedService.GetBanksSelector().subscribe((data: FormDropdownModel[]) => {
      this.banksSelectorData = data;
    });
    this.sharedService.GetNationalitiesSelector().subscribe((data: FormDropdownModel[]) => {
      this.nationalitiesSelectorData = data;
    });
    this.sharedService.GetIqamaIssuePlacesSelector().subscribe((data: FormDropdownModel[]) => {
      this.iqamaIssuePlacesSelectorData = data;
    });
    this.sharedService.GetIqamaJobsSelector().subscribe((data: FormDropdownModel[]) => {
      this.iqamaJobselectorData = data;
    });
    // this.sharedService.GetVehiclesSelector().subscribe((data: FormDropdownModel[]) => {
    //   this.vehiclesSelectorData = data;
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


  fillEditForm(employeeBasicInfoModel: EmployeeModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      employeeId: employeeBasicInfoModel.employeeId,
      managerId: employeeBasicInfoModel.managerId,
      jobId: employeeBasicInfoModel.jobId,
      branchId: employeeBasicInfoModel.branchId,
      statusId: employeeBasicInfoModel.statusId,
      firstNameAR: employeeBasicInfoModel.firstNameAR,
      fatherNameAR: employeeBasicInfoModel.fatherNameAR,
      grandNameAR: employeeBasicInfoModel.grandNameAR,
      lastNameAR: employeeBasicInfoModel.lastNameAR,
      firstNameEN: employeeBasicInfoModel.firstNameEN,
      fatherNameEN: employeeBasicInfoModel.fatherNameEN,
      grandNameEN: employeeBasicInfoModel.grandNameEN,
      lastNameEN: employeeBasicInfoModel.lastNameEN,
      bankId: employeeBasicInfoModel.bankId,
      bankAccountNumber: employeeBasicInfoModel.bankAccountNumber,
      birthDate:this.datePipe.transform(employeeBasicInfoModel.birthDate, 'yyyy-MM-dd'),
      birthPlace: employeeBasicInfoModel.birthPlace,
      nationalityId: employeeBasicInfoModel.nationalityId,
      sponsorId: employeeBasicInfoModel.sponsorId,
      iqamaNumber: employeeBasicInfoModel.iqamaNumber,
      iqamaJobId: employeeBasicInfoModel.iqamaJobId,
      iqamaIssuePlaceId: employeeBasicInfoModel.iqamaIssuePlaceId,
      iqamaIssueDate:this.datePipe.transform(employeeBasicInfoModel.iqamaIssueDate, 'yyyy-MM-dd'),
      iqamaExpireDate:this.datePipe.transform(employeeBasicInfoModel.iqamaExpireDate, 'yyyy-MM-dd'),
      iqamaExpireDateHijri: employeeBasicInfoModel.iqamaExpireDateHijri,
      iqamaIssueDateHijri: employeeBasicInfoModel.iqamaIssueDateHijri,
      iqamaJobDescription: employeeBasicInfoModel.iqamaJobDescription,
      religion: employeeBasicInfoModel.religion,
      address: employeeBasicInfoModel.address,
      image: employeeBasicInfoModel.image,
      drivingLicenseNumber: employeeBasicInfoModel.drivingLicenseNumber,
      drivingLicenseIssueDate:this.datePipe.transform(employeeBasicInfoModel.drivingLicenseIssueDate, 'yyyy-MM-dd'),
      drivingLicenseExpireDate:this.datePipe.transform(employeeBasicInfoModel.drivingLicenseExpireDate, 'yyyy-MM-dd'),
      drivingLicenseIssueDateHijri: employeeBasicInfoModel.drivingLicenseIssueDateHijri,
      drivingLicenseExpireDateHijri: employeeBasicInfoModel.drivingLicenseExpireDateHijri,
      vehicleId: employeeBasicInfoModel.vehicleId
    });
  }

  navigateToAddedEmployee(employeeId: number) {
    if (employeeId)
      this.router.navigate(['.'], { relativeTo: this.acRoute, queryParams: { EmployeeId: employeeId}});

  }
  onFileChange(event: any) {
    this.employeeImageFile = event.target.files[0];
    //this.imageFileName = event.target.files[0].name;
  }

  public formErrors = {
    employeeId: '',
    managerId: '',
    jobId: '',
    branchId: '',
    statusId: '',
    firstNameAR: '',
    fatherNameAR: '',
    grandNameAR: '',
    lastNameAR: '',
    firstNameEN: '',
    fatherNameEN: '',
    grandNameEN: '',
    lastNameEN: '',
    bankId: '',
    bankAccountNumber: '',
    birthDate: '',
    birthPlace: '',
    nationalityId: '',
    sponsorId: '',
    iqamaNumber: '',
    iqamaJobId: '',
    iqamaIssuePlaceId: '',
    iqamaIssueDate: '',
    iqamaExpireDate: '',
    iqamaExpireDateHijri: '',
    iqamaIssueDateHijri: '',
    iqamaJobDescription: '',
    religion: '',
    address: '',
    imageFile: '',
    attachmentFile: '',
    drivingLicenseNumber: '',
    drivingLicenseIssueDate: '',
    drivingLicenseIssueDateHijri: '',
    drivingLicenseExpireDate: '',
    drivingLicenseExpireDateHijri: '',
    vehicleId: ''
  };



}
