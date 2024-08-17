import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { HrService } from '../../services/hr.service';
import { DatePipe } from '@angular/common';
import { FilterItem} from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { EmployeeOverTimeModel } from '../../models/EmployeeOverTimeModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';

@Component({
  selector: 'app-hr-over-time',
  templateUrl: './hr-over-time.component.html',
  styleUrls: ['./hr-over-time.component.css']
})
export class HrOverTimeComponent implements OnInit {
  VacationData: any[] = [];
 
  employeeSelectorData: FormDropdownModel[] = [];
  penaltyTypeSelectorData: FormDropdownModel[]=[];

  selectedOverTimeId: number;
  
  employeeOverTimeModel: EmployeeOverTimeModel ={} as EmployeeOverTimeModel;
  employeeOverTimeResponse:PagedResponseDTO<EmployeeOverTimeModel[]>={
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
    overTimeId: '',
    employeeId: '',
    executionDate: '',
    noHours: '',
    requestDate: '',
    moneyAmount: '',
    notes: '',
    timeFrom: '',
    timeTo: '',

  };
  selectedEmployeeId:number=null;
  isUpdate: boolean=false;
  constructor(private modalService: NgbModal, private hrService: HrService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe,private toaster:ToastrService,private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.getActiveEmployeesSelector();
  }
  getOverTimeByEmployeeId()
  {
    if(!this.checkEmployee())
      return;
    

    this.showLoader=true;
    this.hrService.GetOverTimeByEmployeeId(this.selectedEmployeeId,this.employeeOverTimeResponse).subscribe(data => {
      this.employeeOverTimeResponse.results = data.results;
      this.employeeOverTimeResponse.totalCount = data.totalCount;

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
  openNewOverTimeSidePanel(content: any,overTimeModel:EmployeeOverTimeModel=null) {
    if(!this.checkEmployee())
      return;
    this.isUpdate=false;
    this.buildForm();
    if(overTimeModel)
      this.fillEditForm(overTimeModel);

    this.formGroup.patchValue({employeeId:this.selectedEmployeeId});
   
    this.offcanvasService.open(content, { panelClass: 'add-new-panel', position: 'end' });
  }
  buildForm() {

    this.formGroup = this.form.group({
      overTimeId: [null],
      employeeId: [null],
      executionDate: [null, [Validators.required,CustomValidators.dateGreaterThan(new Date(), 'ادخل تاربخ اكبر')]],
      noHours: [[null], [Validators.required,CustomValidators.regexPattern(RegexType.number)]],
      requestDate: [null],
      moneyAmount: [null, [Validators.required,CustomValidators.regexPattern(RegexType.number)]],
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

  }

  saveEmployeeOverTime() {
    if (!this.validateForm()) {
      return;
    }
    this.employeeOverTimeModel = this.formGroup.value;
    if(this.employeeOverTimeModel?.overTimeId)
      this.editEmployeeOverTime();
    else
      this.addNewEmployeeOverTime();
  }

  addNewEmployeeOverTime()
  {

    this.showAddLoader=true;
    this.hrService.AddNewEmployeeOverTime(this.selectedEmployeeId,this.employeeOverTimeModel).subscribe(data => {
      if(data?.isSuccess) {
        this.formGroup?.reset();
        this.offcanvasService?.dismiss();
        this.getOverTimeByEmployeeId();
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

  editEmployeeOverTime()
  {

    this.showAddLoader=true;
    this.hrService.EditEmployeeOverTime(this.selectedEmployeeId,this.employeeOverTimeModel).subscribe(data => {

      if(data?.isSuccess) {
        this.formGroup?.reset();
        this.offcanvasService?.dismiss();
        this.getOverTimeByEmployeeId();
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

  validateForm(): boolean {
    this._FormService.markFormGroupTouched(this.formGroup);
    if (this.formGroup.valid) {
      return true;
    } else {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, false)
      return false;
    }
  }


  fillEditForm(overTimeModel:EmployeeOverTimeModel) {
    this.isUpdate=true;
    this.formGroup.patchValue({
      overTimeId: overTimeModel.overTimeId,
      employeeId: this.selectedEmployeeId,
      executionDate: this.datePipe.transform(overTimeModel.executionDate, 'yyyy-MM-dd'),
      requestDate: this.datePipe.transform(overTimeModel.requestDate, 'yyyy-MM-dd'),
      noHours: overTimeModel.noHours,
      moneyAmount: overTimeModel.moneyAmount,
      notes: overTimeModel.notes
    });
  }


  openDeleteModal(content: any, overTimeId: number) {
    this.selectedOverTimeId = overTimeId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  getActiveEmployeesSelector() {
    this.hrService.GetActiveEmployeesSelector().subscribe((data :FormDropdownModel[])=> {
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
    this.showAddLoader=true;
    this.hrService.DeleteEmployeeOverTime(this.selectedOverTimeId).subscribe(data => {

      if(data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getOverTimeByEmployeeId();
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

  calculateNoHours() {
    const timeFrom = this.formGroup.get('timeFrom').value;
    const timeTo = this.formGroup.get('timeTo').value;
  
    if (timeFrom && timeTo) {
      const [fromHours, fromMinutes] = timeFrom.split(':').map(Number);
      const [toHours, toMinutes] = timeTo.split(':').map(Number);
  
      const fromTimeInMinutes = fromHours * 60 + fromMinutes;
      const toTimeInMinutes = toHours * 60 + toMinutes;
  
      const diffInMinutes = toTimeInMinutes - fromTimeInMinutes;
  
      if (diffInMinutes >= 0) {
        const diffInHours = diffInMinutes / 60;
        const roundedDiffInHours = Math.round(diffInHours * 10) / 10; // Round to one decimal place
        this.formGroup.get('noHours').setValue(roundedDiffInHours);
      } else {
        this.formGroup.get('noHours').setValue(null);
      }
    }
  }
}
