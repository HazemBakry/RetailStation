import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { EmployeeModel } from '../../../models/Employee/EmployeeModel';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { HrService } from '../../../services/hr.service';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';


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
  sponsorSelectorData: FormDropdownModel[] = [];
  nationalitiesSelectorData: FormDropdownModel[] = [];
  iqamaIssuePlacesSelectorData: FormDropdownModel[] = [];
  visaJobsSelectorData: FormDropdownModel[] = [];
  religionsSelectorData: FormDropdownModel[] = [];
  socialStatusSelectorData: FormDropdownModel[] = [];
  vehiclesSelectorData: FormDropdownModel[] = [];
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  employeeImageFile: File;
  formData: FormData = new FormData();
  public formGroup: FormGroup;



  constructor(private acRoute: ActivatedRoute,
    private router: Router,
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
      grandNameAR: [null],
      lastNameAR: [null],
      firstNameEN: [null, [Validators.required]],
      fatherNameEN: [null, [Validators.required]],
      grandNameEN: [null],
      lastNameEN: [null],
      nationalityId: [null, [Validators.required]],
      sponsorId: [null],
      birthDate: [null, [Validators.required]],
      birthPlace: [null],
      religionId: [null, [Validators.required]],
      address: [null],
      imageFile: [null],
      attachmentFile: [null],


      socialStatusId: [null, [Validators.required]],
      phone: [null],
      passportNumber: [null, [CustomValidators.regexPattern(RegexType.number)]],
      passportIssuanceDate: [null],
      passportExpireDate: [null],
      passportIssuancePlace: [null],
      arrivalPort: [null],
      borderEntryNumber: [null],
      visaNumber: [null, [CustomValidators.regexPattern(RegexType.number)]],
      visaIssueDate: [null],
      visaJobId: [null],
      email: [null, [CustomValidators.regexPattern(RegexType.email)]],
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

  saveEmployeeBasicInfo() {
    if (!this.validateForm()) {
      return;
    }
    this.employeeBasicInfoModel = this.formGroup.value;

    this.formData = new FormData();
    if (this.employeeImageFile != null) {
      this.formData.append('imageFile', this.employeeImageFile);
    }


    Object.keys(this.formGroup.value).forEach(key => {
      if (key != 'imageFile' && this.formGroup.value[key])
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
        this.navigateToAddedEmployee(this.employeeId);
        // this.getEmployeeBasicInfo();
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
    this.hrService.GetActiveEmployeesSelector().subscribe((data: FormDropdownModel[]) => {
      this.employeesSelectorData = data;
    });
    this.sharedService.GetBranchesSelector().subscribe((data: FormDropdownModel[]) => {
      this.branchSelectorData = data;
    });
     this.sharedService.GetSponsorsSelector().subscribe((data: FormDropdownModel[]) => {
      this.sponsorSelectorData = data;
    });
    this.lookupService.GetWorkStatusSelector().subscribe((data: FormDropdownModel[]) => {
      this.workStatusSelectorData = data;
    });
    this.hrService.GetJobsSelector().subscribe((data: FormDropdownModel[]) => {
      this.jobsSelectorData = data;
    });

    this.lookupService.GetNationalitiesSelector().subscribe((data: FormDropdownModel[]) => {
      this.nationalitiesSelectorData = data;
    });

    this.sharedService.GetVisaJobsSelector().subscribe((data: FormDropdownModel[]) => {
      this.visaJobsSelectorData = data;
    });
    this.lookupService.GetReligionsSelector().subscribe((data: FormDropdownModel[]) => {
      this.religionsSelectorData = data;
    });
    this.lookupService.GetSocialStatusSelector().subscribe((data: FormDropdownModel[]) => {
      this.socialStatusSelectorData = data;
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
      borderEntryNumber: employeeBasicInfoModel.borderEntryNumber,
      passportNumber: employeeBasicInfoModel.passportNumber,

      arrivalPort: employeeBasicInfoModel.arrivalPort,
      visaNumber: employeeBasicInfoModel.visaNumber,
      visaIssueDate: this.datePipe.transform(employeeBasicInfoModel.visaIssueDate, 'yyyy-MM-dd'),
      passportIssuanceDate: this.datePipe.transform(employeeBasicInfoModel.passportIssuanceDate, 'yyyy-MM-dd'),
      passportExpireDate: this.datePipe.transform(employeeBasicInfoModel.passportExpireDate, 'yyyy-MM-dd'),

      birthDate: this.datePipe.transform(employeeBasicInfoModel.birthDate, 'yyyy-MM-dd'),
      birthPlace: employeeBasicInfoModel.birthPlace,
      nationalityId: employeeBasicInfoModel.nationalityId,
      sponsorId: employeeBasicInfoModel.sponsorId,



      religionId: employeeBasicInfoModel.religionId,
      address: employeeBasicInfoModel.address,
      image: employeeBasicInfoModel.image,

      phone: employeeBasicInfoModel.phone,
      email: employeeBasicInfoModel.email,
      socialStatusId: employeeBasicInfoModel.socialStatusId,

      visaJobId: employeeBasicInfoModel.visaJobId,
    });
  }

  navigateToAddedEmployee(employeeId: number) {
    if (employeeId)
      this.router.navigate(['.'], { relativeTo: this.acRoute, queryParams: { EmployeeId: employeeId,timestamp: new Date().getTime() } });

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
    birthDate: '',
    birthPlace: '',
    nationalityId: '',
    sponsorId: '',

    religionId: '',
    address: '',
    imageFile: '',
    attachmentFile: '',

    passportNumber: '',
    passportIssuanceDate: '',
    passportExpireDate: '',
    passportIssuancePlace: '',
    borderEntryNumber: '',
    borderEntryDate: '',
    arrivalPort: '',
    visaNumber: '',
    visaIssueDate: '',
    visaJobId: '',
    phone: '',
    socialStatusId: '',
    email: '',
  };



}
