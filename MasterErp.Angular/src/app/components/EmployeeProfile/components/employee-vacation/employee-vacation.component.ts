import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { FilterItem, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { CustomValidators } from 'src/app/components/Shared/services/custom-validators';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { EmployeeVacationModel } from 'src/app/components/HR/models/EmployeeVacationModel';
import { EmployeeProfileService } from '../../services/employee-profile.service';

@Component({
  selector: 'app-employee-vacation',
  templateUrl: './employee-vacation.component.html',
  styleUrls: ['./employee-vacation.component.css']
})
export class EmployeeVacationComponent implements OnInit {
  VacationData: any[] = [];
  employeeVacationsData: EmployeeVacationModel[] = [];
  employeeSelectorData: FormDropdownModel[] = [];
  vacationTypeSelectorData: FormDropdownModel[]=[];

  selectedVacationId: number;
  CategorySearch: any;
  CategoryName = 'قائمة الموظفين';
  SearchFilterModel: SearchFilterModel = {
    currentPage: 1,
    pageSize: 25,
    filterModel: { filterItems: [] }
  };
  employeeVacationModel: EmployeeVacationModel ={} as EmployeeVacationModel;
  vacationResponse:PagedResponseDTO<EmployeeVacationModel[]>={
    results:[],
    filterList:[],
    pageSize: 25,
    currentPage:1,
    searchText:''

  };
  showLoader: boolean=false;
  detailsView: boolean=false;
  showAddLoader: boolean=false;

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
  selectedEmployeeId:number=null;
  isUpdate: boolean=false;
  constructor(private modalService: NgbModal, private employeeProfile: EmployeeProfileService,private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe,private toaster:ToastrService,private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.initNewVacationForm();
    this.getVacationTypesSelector();
    this.getActiveEmployeesSelector();
  }

  toggleDetails(vacationModel:EmployeeVacationModel=null)
  {
    this.vacationResponse.results =[];
    this.detailsView=!this.detailsView;
    if(this.detailsView)
      this.getVacations();

    this.initNewVacationForm(vacationModel);
  }
  getVacations()
  {

    this.showLoader=true;
    this.employeeProfile.GetVacations(this.vacationResponse).subscribe(data => {
      this.vacationResponse.results = data.results;
      this.vacationResponse.totalCount = data.totalCount;

      this.showLoader=false;
    }, err=>{
      this.showLoader=false;
    },()=>{
      this.showLoader=false;
    });

    
  }

  initNewVacationForm(vacationModel:EmployeeVacationModel=null) {

    this.isUpdate=false;
    this.buildForm();
    if(vacationModel)
      this.fillEditForm(vacationModel);

    // this.formGroup.patchValue({employeeId:this.selectedEmployeeId});
    
  }
  buildForm() {
    this.formGroup = this.form.group({
      vacationId: [null],
      employeeId: [null],
      isAlternativeAvailable: [false],
      alternativeEmployeeId: [null],
      vacationTypeId: [null, [Validators.required]],
      fromDate: [null, [Validators.required]],
      toDate: [null, [Validators.required]],
      lastDayWork: [null, [Validators.required]],
      notes: [null],

    },{
      validators: [CustomValidators.endDateGreaterThanStartDate('lastDayWork', 'fromDate','يجب ان يكون تاريخ بدء الاجازه بعد اخر يوم عمل'),
        CustomValidators.endDateGreaterThanStartDate('fromDate', 'toDate','يجب ان يكون تاريخ انهاء الاجازه بعد البدء')],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
    this.formGroup.get('isAlternativeAvailable').valueChanges.subscribe((regionId) => {

    });
  }

  saveVacation() {
    if (!this.validateForm()) {
      return;
    }

    

    this.employeeVacationModel = this.formGroup.value;

    if(this.employeeVacationModel?.vacationId)
      this.editVacation();
    else
      this.addNewVacation();
  }

  addNewVacation()
  {

    this.showAddLoader=true;
    this.employeeProfile.AddNewVacation(this.employeeVacationModel).subscribe(data => {
      if(data?.isSuccess) {
        this.formGroup?.reset();
        // this.offcanvasService?.dismiss();
        // this.getVacations();
        this.toaster.success(data?.message);
      }
      else {
        this.toaster.error(data?.message);
      }
      this.showAddLoader=false;
    }, err=>{
      this.showAddLoader=false;
    },()=>{
      this.showAddLoader=false;
    });

    

  }

  editVacation()
  {

    this.showAddLoader=true;
    this.employeeProfile.EditVacation(this.employeeVacationModel).subscribe(data => {

      if(data?.isSuccess) {
        this.formGroup?.reset();
        // this.offcanvasService?.dismiss();
        // this.getVacations();
        this.toaster.success(data?.message);
      }
      else {
        this.toaster.error(data?.message);
      }
      this.showAddLoader=false;
    }, err=>{
      this.showAddLoader=false;
    },()=>{
      this.showAddLoader=false;
    });

    
  }
  getVacationTypesSelector(){
    this.sharedService.GetVacationTypesSelector().subscribe((data :FormDropdownModel[])=> {
      this.vacationTypeSelectorData = data;
    });
  }
  getActiveEmployeesSelector() {
    this.sharedService.GetActiveEmployeesSelector().subscribe((data :FormDropdownModel[])=> {
      this.employeeSelectorData = data;
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


  fillEditForm(vacationModel:EmployeeVacationModel) {
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


  filterChecked(filterItems: FilterItem[]) {
    this.vacationResponse.filterList = filterItems;
    this.getVacations();
 }

 pageChanged(obj: any) {
   this.vacationResponse.currentPage = obj.page;
   this.getVacations();
 }


  deleteVacation() {
    this.showAddLoader=true;
    this.employeeProfile.DeleteVacation(this.selectedVacationId).subscribe(data => {

      if(data?.isSuccess) {
        this.modalService?.dismissAll();
        // this.getVacations();
        this.toaster.success(data?.message);
      }
      else {
        this.toaster.error(data?.message);
      }
      this.showAddLoader=false;
    }, err=>{
      this.showAddLoader=false;
    },()=>{
      this.showAddLoader=false;
    });
  }
}
