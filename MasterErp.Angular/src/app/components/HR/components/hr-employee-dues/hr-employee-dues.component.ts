import { Component, OnInit } from '@angular/core';
import { EmployeeSalarySummaryModel } from '../../models/EmployeeSalarySummaryModel';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { HrService } from '../../services/hr.service';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeContractModel } from '../../models/Employee/EmployeeContractModel';
import { DatePipe } from '@angular/common';
import { EmployeeDueModel } from '../../models/EmployeeDueModel';

@Component({
  selector: 'app-hr-employee-dues',
  templateUrl: './hr-employee-dues.component.html',
  styleUrls: ['./hr-employee-dues.component.css']
})
export class HrEmployeeDuesComponent implements OnInit {

  TitleList = ['الموارد البشرية', 'الحضور والانصراف'];
  URLs: any[] = [];
  Branches: any[] = [];
  branchSelectorData: GeneralSelectorModel[] = [];
  employeeSelectorData: GeneralSelectorModel[] = [];
  employeeDueTypesSelectorData: GeneralSelectorModel[] = [];
  yearsSelectorData: GeneralSelectorModel[] = [];
  arabicMonths = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];
  monthsSelectorData: GeneralSelectorModel[] = this.arabicMonths.map((name, index) => ({
    value: index + 1,
    name
  }));
  filterList: FilterModel[] = [];
  showLoader: boolean = false;

  selectedYear: number;
  selectedMonth: number;
  selectedEmployeeId: number;
  selectedBranchId: number;
  startWorkingDate: string = '';
  lastWorkingDate: string = '';
  employeeContractInfoModel: EmployeeContractModel;
  employeeDueModel: EmployeeDueModel = {
    vacationDues: 0,
    endOfServiceDues: 0,
    currentMonthSalary: 0,
    homeAllowance: 0,
    advances: 0,
    netAmount : 0,
  } as EmployeeDueModel;
  pagedResponseModel: PagedResponseDTO<EmployeeDueModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''
  };

  constructor(private modalService: NgbModal,
    private toaster: ToastrService,
    private hrService: HrService,
    private lookupService: LookupService,
    private employeeService: EmployeeService,
    private sharedService: SharedService,
    private datePipe: DatePipe,
    private router: Router) { }

  ngOnInit(): void {

    this.loadSelectors();
    // this.getAttendance_Data();
    // this.GetAttendance_Filters();

  }
  employeeChanged(employeeId: any) {
    this.selectedEmployeeId = employeeId;
    this.getEmployeeContractInfo();
    this.getEmployeeDueStartDate();
  }


  getEmployeeContractInfo() {
    this.showLoader = true;
    this.employeeService.GetEmployeeContractInfoById(this.selectedEmployeeId).subscribe((data: EmployeeContractModel) => {
      this.employeeContractInfoModel = data;
      this.selectedBranchId = data?.branchId;
      if (data) {
      }

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });


  }

  loadSelectors() {
    this.sharedService.GetBranchesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.branchSelectorData = data;
    });
    this.hrService.GetActiveEmployeesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.employeeSelectorData = data;
    });
    this.lookupService.GetEmployeeDueTypesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.employeeDueTypesSelectorData = data;
    });

    const currentYear = new Date().getFullYear();
    this.selectedYear = currentYear;
    for (let i = currentYear - 5; i <= currentYear; i++) {
      this.yearsSelectorData.push({ value: i, name: i });
    }
    this.yearsSelectorData.reverse();
  }
  search() {
    if (!this.checkEmployee())
      return;
    this.pagedResponseModel.results = [];
    this.pagedResponseModel.currentPage = 1;
    this.pagedResponseModel.totalCount = 0;
    this.getEmployeeDues();
  }
  calculateDues() {
  }
  checkEmployee() {
    if (!this.selectedEmployeeId) {
      this.toaster.warning('من فضلك اختر من قائمة الموظفين', 'تحذير');
      return false;
    }
    return true;
  }
  getEmployeeDueStartDate() {
    this.hrService.getEmployeeDueStartDate(this.selectedEmployeeId).subscribe(data => {
      if(data)
        this.startWorkingDate =this.datePipe.transform(data, 'yyyy-MM-dd')
    }, err => {
    }, () => {
    });
  }
  
  getEmployeeDues() {
    if(!this.checkEmployee())
      return;
    this.showLoader = true;
    this.hrService.getEmployeeDues(this.selectedEmployeeId,this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data?.results;
      this.pagedResponseModel.totalCount = data?.totalCount;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  mapFilters() {
    this.pagedResponseModel.filterList = [];
    if (this.selectedEmployeeId) {
      this.pagedResponseModel.filterList.push({ categoryName: 'EmployeeId', itemFlag: this.selectedEmployeeId?.toString() })
    }
    if (this.selectedBranchId) {
      this.pagedResponseModel.filterList.push({ categoryName: 'BranchId', itemFlag: this.selectedBranchId?.toString() })
    }
  }
  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getEmployeeDues();
  }

}
