import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { HrService } from '../../services/hr.service';
import { DatePipe } from '@angular/common';
import { FilterItem} from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';
import { EmployeeSickLeaveModel } from '../../models/EmployeeSickLeaveModel';

@Component({
  selector: 'app-hr-sick-leave',
  templateUrl: './hr-sick-leave.component.html',
  styleUrls: ['./hr-sick-leave.component.css']
})
export class HrSickLeaveComponent implements OnInit {
  VacationData: any[] = [];
 
  employeeSelectorData: FormDropdownModel[] = [];
  penaltyTypeSelectorData: FormDropdownModel[]=[];

  selectedSickLeaveId: number;
  
  employeeSickLeaveModel: EmployeeSickLeaveModel ={} as EmployeeSickLeaveModel;
  employeeSickLeaveResponse:PagedResponseDTO<EmployeeSickLeaveModel[]>={
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
    sickLeaveId: '',
    employeeId: '',
    executionDate: '',
    noDays: '',
    requestDate: '',
    moneyAmount: '',
    notes: '',
    fromDate: '',
    toDate: '',

  };
  selectedEmployeeId:number=null;
  isUpdate: boolean=false;
  constructor(private modalService: NgbModal, private hrService: HrService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe,private toaster:ToastrService,private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.getActiveEmployeesSelector();
  }
  getSickLeaveByEmployeeId()
  {
    if(!this.checkEmployee())
      return;
    

    this.showLoader=true;
    this.hrService.GetSickLeavesByEmployeeId(this.selectedEmployeeId,this.employeeSickLeaveResponse).subscribe(data => {
      this.employeeSickLeaveResponse.results = data.results;
      this.employeeSickLeaveResponse.totalCount = data.totalCount;

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
  openNewSickLeaveSidePanel(content: any,sickLeaveModel:EmployeeSickLeaveModel=null) {
    if(!this.checkEmployee())
      return;
    this.isUpdate=false;
    this.buildForm();
    if(sickLeaveModel)
      this.fillEditForm(sickLeaveModel);

    this.formGroup.patchValue({employeeId:this.selectedEmployeeId});
   
    this.offcanvasService.open(content, { panelClass: 'add-new-panel', position: 'end' });
  }
  buildForm() {

    this.formGroup = this.form.group({
      sickLeaveId: [null],
      employeeId: [null],
      executionDate: [null, [Validators.required,CustomValidators.dateGreaterThan(new Date(), 'ادخل تاربخ اكبر')]],
      noDays: [null, [Validators.required,CustomValidators.regexPattern(RegexType.number)]],
      requestDate: [null],
      moneyAmount: [null, [Validators.required,CustomValidators.regexPattern(RegexType.number)]],
      notes: [null],
      fromDate: [null],
      toDate: [null],

    },{
      validators: [CustomValidators.endDateGreaterThanStartDate('fromDate', 'toDate','يجب ان يكون تاريخ انتهاء الاجازه بعد تاريخ البدء')],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
    this.formGroup.get('fromDate').valueChanges.subscribe(() => {
      this.calculateNoDays();
    });
  
    this.formGroup.get('toDate').valueChanges.subscribe(() => {
      this.calculateNoDays();
    });

  }

  saveEmployeeSickLeave() {
    if (!this.validateForm()) {
      return;
    }
    this.employeeSickLeaveModel = this.formGroup.value;
    if(this.employeeSickLeaveModel?.sickLeaveId)
      this.editEmployeeSickLeave();
    else
      this.addNewEmployeeSickLeave();
  }

  addNewEmployeeSickLeave()
  {

    this.showAddLoader=true;
    this.hrService.AddNewEmployeeSickLeave(this.selectedEmployeeId,this.employeeSickLeaveModel).subscribe(data => {
      if(data?.isSuccess) {
        this.formGroup?.reset();
        this.offcanvasService?.dismiss();
        this.getSickLeaveByEmployeeId();
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

  editEmployeeSickLeave()
  {

    this.showAddLoader=true;
    this.hrService.EditEmployeeSickLeave(this.selectedEmployeeId,this.employeeSickLeaveModel).subscribe(data => {

      if(data?.isSuccess) {
        this.formGroup?.reset();
        this.offcanvasService?.dismiss();
        this.getSickLeaveByEmployeeId();
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


  fillEditForm(sickLeaveModel:EmployeeSickLeaveModel) {
    this.isUpdate=true;
    this.formGroup.patchValue({
      sickLeaveId: sickLeaveModel.sickLeaveId,
      employeeId: this.selectedEmployeeId,
      executionDate: this.datePipe.transform(sickLeaveModel.executionDate, 'yyyy-MM-dd'),
      requestDate: this.datePipe.transform(sickLeaveModel.requestDate, 'yyyy-MM-dd'),
      noDays: sickLeaveModel.noDays,
      moneyAmount: sickLeaveModel.moneyAmount,
      notes: sickLeaveModel.notes
    });
  }


  openDeleteModal(content: any, sickLeaveId: number) {
    this.selectedSickLeaveId = sickLeaveId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  getActiveEmployeesSelector() {
    this.hrService.GetActiveEmployeesSelector().subscribe((data :FormDropdownModel[])=> {
      this.employeeSelectorData = data;
    });
  }

  filterChecked(filterItems: FilterItem[]) {
    this.employeeSickLeaveResponse.filterList = filterItems;
    this.getSickLeaveByEmployeeId();
 }

 pageChanged(obj: any) {
   this.employeeSickLeaveResponse.currentPage = obj.page;
   this.getSickLeaveByEmployeeId();
 }


  deleteEmployeeSickLeave() {
    this.showAddLoader=true;
    this.hrService.DeleteEmployeeSickLeave(this.selectedSickLeaveId).subscribe(data => {

      if(data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getSickLeaveByEmployeeId();
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

  calculateNoDays() {
    const fromDate = this.formGroup.get('fromDate').value;
    const toDate = this.formGroup.get('toDate').value;
  
    if (fromDate && toDate) {

      var from=new Date(fromDate);
      var to=new Date(toDate);
      from.setHours(0, 0, 0, 0);
      to.setHours(0, 0, 0, 0);
    
      // Calculate the difference in milliseconds
      const diffInMills = to.getTime() - from.getTime();

      // Convert milliseconds to days
      //const diffInDays = Math.floor(diffInMills / (1000 * 60 * 60 * 24));
      const diffInDays = Math.floor(diffInMills / (1000 * 60 * 60 * 24)) + 1;

      if (diffInDays > 0) {
        this.formGroup.get('noDays').setValue(diffInDays);
      } else {
        this.formGroup.get('noDays').setValue(null);
      }
    }
  }
}