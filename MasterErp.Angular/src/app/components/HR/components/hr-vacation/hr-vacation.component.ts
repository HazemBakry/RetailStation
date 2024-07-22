import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { HrService } from '../../services/hr.service';
import { DatePipe } from '@angular/common';
import { FilterItem, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { EmployeeVacationModel } from '../../models/EmployeeVacationModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { CustomValidators } from 'src/app/components/Shared/services/custom-validators';

@Component({
  selector: 'app-hr-vacation',
  templateUrl: './hr-vacation.component.html',
  styleUrls: ['./hr-vacation.component.css']
})
export class HrVacationComponent implements OnInit {
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
  employeeVacationResponse:PagedResponseDTO<EmployeeVacationModel[]>={
    results:[],
    filterList:[],
    pageSize: 25,
    currentPage:1,
    searchText:''

  };
  showLoader: boolean=false;
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
  constructor(private modalService: NgbModal, private hrService: HrService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe,private toaster:ToastrService,private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {

    // this.getVacationData();
    this.getActiveEmployeesSelector();
  }
  getVacationsByEmployeeId()
  {
    if(!this.checkEmployee())
      return;
    

    this.showLoader=true;
    this.hrService.GetVacationsByEmployeeId(this.selectedEmployeeId,this.employeeVacationResponse).subscribe(data => {
      this.employeeVacationResponse.results = data.results;
      this.employeeVacationResponse.totalCount = data.totalCount;

      this.showLoader=false;
    }, err=>{
      this.showLoader=false;
    },()=>{
      this.showLoader=false;
    });

    
  }

  checkEmployee()
  {

    if(!this.selectedEmployeeId)
    {
      this.toaster.warning('من فضلك اختر من قائمة الموظفين','تحذير');
      return false;
    }
    return true;
  }
  openNewVacationSidePanel(content: any,vacationModel:EmployeeVacationModel=null) {
    if(!this.checkEmployee())
      return;
    this.isUpdate=false;
    this.buildForm();
    if(vacationModel)
      this.fillEditForm(vacationModel);

    this.formGroup.patchValue({employeeId:this.selectedEmployeeId});
    this.getVacationTypesSelector();
    this.offcanvasService.open(content, { panelClass: 'add-vacation-panel', position: 'end' });
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
      validators: [CustomValidators.endDateGreaterThanStartDate('lastDayWork', 'fromDate'),
        CustomValidators.endDateGreaterThanStartDate('fromDate', 'toDate')],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
    this.formGroup.get('isAlternativeAvailable').valueChanges.subscribe((regionId) => {

    });
  }

  saveEmployeeVacation() {
    if (!this.validateForm()) {
      return;
    }

    

    this.employeeVacationModel = this.formGroup.value;

    if(this.employeeVacationModel?.vacationId)
      this.editEmployeeVacation();
    else
      this.addNewEmployeeVacation();
  }

  addNewEmployeeVacation()
  {

    this.showAddLoader=true;
    this.hrService.AddNewEmployeeVacation(this.selectedEmployeeId,this.employeeVacationModel).subscribe(data => {
      if(data?.isSuccess) {
        this.formGroup?.reset();
        this.offcanvasService?.dismiss();
        this.getVacationsByEmployeeId();
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

  editEmployeeVacation()
  {

    this.showAddLoader=true;
    this.hrService.EditEmployeeVacation(this.selectedEmployeeId,this.employeeVacationModel).subscribe(data => {

      if(data?.isSuccess) {
        this.formGroup?.reset();
        this.offcanvasService?.dismiss();
        this.getVacationsByEmployeeId();
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
    this.hrService.GetVacationTypesSelector().subscribe((data :FormDropdownModel[])=> {
      this.vacationTypeSelectorData = data;
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

  getActiveEmployeesSelector() {
    this.hrService.GetActiveEmployeesSelector().subscribe((data :FormDropdownModel[])=> {
      this.employeeSelectorData = data;
    });
  }

  filterChecked(filterItems: FilterItem[]) {
    this.employeeVacationResponse.filterList = filterItems;
    this.getVacationsByEmployeeId();
 }

 pageChanged(obj: any) {
   this.employeeVacationResponse.currentPage = obj.page;
   this.getVacationsByEmployeeId();
 }


  deleteVacation() {
    this.showAddLoader=true;
    this.hrService.DeleteEmployeeVacation(this.selectedVacationId).subscribe(data => {

      if(data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getVacationsByEmployeeId();
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
