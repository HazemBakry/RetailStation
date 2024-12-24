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
import { EmployeeLoanModel } from 'src/app/components/HR/models/EmployeeLoanModel';
import { EmployeeProfileService } from '../../services/employee-profile.service';


@Component({
  selector: 'app-team-work-loans',
  templateUrl: './team-work-loans.component.html',
  styleUrls: ['./team-work-loans.component.css']
})
export class TeamWorkLoansComponent implements OnInit {
  LoanData: any[] = [];

  
  CategorySearch: any;
  CategoryName = 'قائمة الموظفين';
  SearchFilterModel: SearchFilterModel = {
    currentPage: 1,
    pageSize: 25,
    filterModel: { filterItems: [] }
  };
  employeeLoanModel: EmployeeLoanModel = {} as EmployeeLoanModel;
  loanResponse: PagedResponseDTO<EmployeeLoanModel[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: ''

  };
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  selectedLoanId: number;
  selectedEmployeeId: number = null;
  selectedApproveStatus:boolean=false;
  constructor(private modalService: NgbModal, private employeeProfile: EmployeeProfileService, private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.getTeamWorkLoans();
  }

  getTeamWorkLoans() {

    this.showLoader = true;
    this.employeeProfile.GetTeamWorkLoans(this.loanResponse).subscribe(data => {
      this.loanResponse.results = data.results;
      this.loanResponse.totalCount = data.totalCount;

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });


  }




  filterChecked(filterItems: FilterItem[]) {
    this.loanResponse.filterList = filterItems;
    this.getTeamWorkLoans();
  }

  pageChanged(obj: any) {
    this.loanResponse.currentPage = obj.page;
    this.getTeamWorkLoans();
  }

  openApproveModal(content: any, loanId: number, employeeId: number,approveStatus:boolean) {
    this.selectedLoanId = loanId;
    this.selectedEmployeeId = employeeId;
    this.selectedApproveStatus=approveStatus;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  approveLoan() {
    this.showAddLoader = true;
    this.employeeProfile.ApproveLoan(this.selectedLoanId,this.selectedEmployeeId,this.selectedApproveStatus).subscribe(data => {

      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getTeamWorkLoans();
        this.toaster.success(data?.message);
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
}
