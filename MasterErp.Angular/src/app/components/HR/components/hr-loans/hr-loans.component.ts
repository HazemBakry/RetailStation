import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { HrService } from '../../services/hr.service';
import { DatePipe } from '@angular/common';
import { FilterItem} from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { EmployeeLoanModel } from '../../models/EmployeeLoanModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';
import { SharedService } from 'src/app/components/Shared/services/shared.service';

@Component({
  selector: 'app-hr-loans',
  templateUrl: './hr-loans.component.html',
  styleUrls: ['./hr-loans.component.css']
})
export class HrLoansComponent implements OnInit {
  VacationData: any[] = [];
  employeeSelectorData: FormDropdownModel[] = [];
  penaltyTypeSelectorData: FormDropdownModel[]=[];
  selectedLoanId: number;
  employeeLoanModel: EmployeeLoanModel ={} as EmployeeLoanModel;
  showLoader: boolean=false;
  showAddLoader: boolean=false;
  public formGroup: FormGroup;
  selectedEmployeeId:number=null;
  isUpdate: boolean=false;

  employeeLoanResponse:PagedResponseDTO<EmployeeLoanModel[]>={
    results:[],
    filterList:[],
    pageSize: 25,
    currentPage:1,
    searchText:''
  };
  public formErrors = {
    loanId: '',
    employeeId: '',
    paymentFromDate: '',
    loanTypeId: '',
    loanAmount: '',
    paymentAmount: '',
    isApproved: '',
    notes: ''
  };

  constructor(private modalService: NgbModal, private hrService: HrService,private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe,private toaster:ToastrService,private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.getActiveEmployeesSelector();
  }
  getLoanByEmployeeId()
  {
    if(!this.checkEmployee())
      return;

    this.showLoader=true;
    this.hrService.GetLoansByEmployeeId(this.selectedEmployeeId,this.employeeLoanResponse).subscribe(data => {
      this.employeeLoanResponse.results = data.results;
      this.employeeLoanResponse.totalCount = data.totalCount;

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

  openNewSidePanel(content: any,loanModel:EmployeeLoanModel=null) {
    if(!this.checkEmployee())
      return;

    this.getLoanTypesSelector();

    this.isUpdate=false;
    this.buildForm();
    if(loanModel)
      this.fillEditForm(loanModel);

    this.formGroup.patchValue({employeeId:this.selectedEmployeeId});
   
    this.offcanvasService.open(content, { panelClass: 'add-new-panel', position: 'end' });
  }
  buildForm() {

    this.formGroup = this.form.group({
      loanId: [null],
      employeeId: [null],
      loanTypeId: [null,[Validators.required]],
      loanAmount: [null,[Validators.required,CustomValidators.regexPattern(RegexType.number)]],
      paymentAmount: [null,[Validators.required,CustomValidators.regexPattern(RegexType.number)]],
      isApproved: [null],
      paymentFromDate: [null, [Validators.required,CustomValidators.dateGreaterThan(new Date(), 'ادخل تاربخ اكبر')]],
      notes: [null],

    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });

  }

  saveEmployeeLoan() {
    if (!this.validateForm()) {
      return;
    }
    this.employeeLoanModel = this.formGroup.value;
    if(this.employeeLoanModel?.loanId)
      this.editEmployeeLoan();
    else
      this.addNewEmployeeLoan();
  }

  addNewEmployeeLoan()
  {

    this.showAddLoader=true;
    this.hrService.AddNewEmployeeLoan(this.selectedEmployeeId,this.employeeLoanModel).subscribe(data => {
      if(data?.isSuccess) {
        this.formGroup?.reset();
        this.offcanvasService?.dismiss();
        this.getLoanByEmployeeId();
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

  editEmployeeLoan()
  {

    this.showAddLoader=true;
    this.hrService.EditEmployeeLoan(this.selectedEmployeeId,this.employeeLoanModel).subscribe(data => {

      if(data?.isSuccess) {
        this.formGroup?.reset();
        this.offcanvasService?.dismiss();
        this.getLoanByEmployeeId();
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


  fillEditForm(loanModel:EmployeeLoanModel) {
    this.isUpdate=true;

    this.formGroup.patchValue({
      loanId: loanModel.loanId,
      loanTypeId: loanModel.loanTypeId,
      loanAmount: loanModel.loanAmount,
      paymentAmount: loanModel.paymentAmount,
      isApproved: loanModel.isApproved,
      employeeId: this.selectedEmployeeId,
      paymentFromDate: this.datePipe.transform(loanModel.paymentFromDate, 'yyyy-MM-dd'),
      notes: loanModel.notes
    });
  }


  openDeleteModal(content: any, loanId: number) {
    this.selectedLoanId = loanId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  getActiveEmployeesSelector() {
    this.hrService.GetActiveEmployeesSelector().subscribe((data :FormDropdownModel[])=> {
      this.employeeSelectorData = data;
    });
  }

  filterChecked(filterItems: FilterItem[]) {
    this.employeeLoanResponse.filterList = filterItems;
    this.getLoanByEmployeeId();
 }

 pageChanged(obj: any) {
   this.employeeLoanResponse.currentPage = obj.page;
   this.getLoanByEmployeeId();
 }


  deleteEmployeeLoan() {
    this.showAddLoader=true;
    this.hrService.DeleteEmployeeLoan(this.selectedLoanId).subscribe(data => {

      if(data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getLoanByEmployeeId();
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
  loanTypesSelectorData:FormDropdownModel[]=[];
  getLoanTypesSelector(){
    this.hrService.GetLoanTypesSelector().subscribe((data :FormDropdownModel[])=> {
      this.loanTypesSelectorData = data;
    });
  }
  
}


