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
import { DuesPreparationModel, EmployeeDueModel, SalaryDuesMonthModel } from '../../models/EmployeeDueModel';
import { DueTypeEnum } from 'src/app/components/Shared/Enums/DueTypeEnum';
import { EmployeeStatusEnum } from 'src/app/components/Shared/Enums/EmployeeStatusEnum';
import { DateModel, getSalaryDuesMonths } from '../../models/DateModel';

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
  // yearsSelectorData: GeneralSelectorModel[] = [];
  // arabicMonths = [
  //   "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  //   "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  // ];
  // monthsSelectorData: GeneralSelectorModel[] = this.arabicMonths.map((name, index) => ({
  //   value: index + 1,
  //   name
  // }));
  salaryMonthsSelector: GeneralSelectorModel[] = [];
  salaryDuesMonths: DateModel[] = [];
  filterList: FilterModel[] = [];
  showLoader: boolean = false;

  selectedYear: number;
  selectedMonth: number;
  selectedEmployeeId: number;
  selectedDueTypeId: number;
  selectedBranchId: number;
  public DueType = DueTypeEnum;
  joinDate: string = '';
  lastJoinDate: string = '';
  employeeContractInfoModel: EmployeeContractModel;
  duesCreateModel: DuesPreparationModel = {} as DuesPreparationModel;
  employeeDueModel: EmployeeDueModel = {
    dueTypeId: null,
    joinDate: null,
    lastJoinDate: null,
    executionDate: null,
    addSalaryToDue: null,
    salaryYear: null,
    salaryMonth: null,
    vacationDues: 0,
    endOfServiceDues: 0,
    currentMonthSalary: 0,
    homeAllowance: 0,
    advances: 0,
    netAmount: 0,
    totalDueAmount: 0,
    flightTicketAmount: 0,
    covenant: 0,
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
    this.duesCreateModel = {} as DuesPreparationModel;
    this.getEmployeeDuesPreparationDate();
  }
  dueTypeChanged(dueTypeId: DueTypeEnum) {
    this.duesCreateModel = {} as DuesPreparationModel;
    this.selectedDueTypeId = dueTypeId;
    this.duesCreateModel.dueTypeId = dueTypeId;
    this.duesCreateModel.vacationDues = 0;
    this.duesCreateModel.endOfServiceDues = 0;
    this.employeeSelectorData =[];
    this.loadEmployeeSelector(dueTypeId);


  }

  loadEmployeeSelector(dueTypeId: DueTypeEnum) {
    this.hrService.GetEmployeesForDuesSelector(dueTypeId).subscribe((data: GeneralSelectorModel[]) => {
      this.employeeSelectorData = data;
    });
  }
  loadSelectors() {
    this.sharedService.GetBranchesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.branchSelectorData = data;
    });

    this.lookupService.GetEmployeeDueTypesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.employeeDueTypesSelectorData = data;
    });

    // const currentYear = new Date().getFullYear();
    // this.selectedYear = this.employeeDueModel.salaryYear = currentYear;
    // for (let i = currentYear - 5; i <= currentYear; i++) {
    //   this.yearsSelectorData.push({ value: i, name: i });
    // }
    // this.yearsSelectorData.reverse();
  }
  search() {
    if (!this.checkEmployee())
      return;
    this.pagedResponseModel.results = [];
    this.pagedResponseModel.currentPage = 1;
    this.pagedResponseModel.totalCount = 0;
    this.getEmployeeDues();
  }
  getEmployeeDuesPreparationDate() {
    //this.joinDate = null;
    if (!this.selectedEmployeeId || !this.selectedDueTypeId) {
      return;
    }
    this.showLoader = true;
    this.hrService.GetEmployeeDuesPreparationDate(this.selectedEmployeeId, this.selectedDueTypeId, this.duesCreateModel).subscribe((data:DuesPreparationModel) => {
      if (data) {
        this.duesCreateModel = data;
        this.selectedBranchId = data.branchId;
        this.employeeDueModel.joinDate = this.datePipe.transform(data.joinDate, 'yyyy-MM-dd')
        this.duesCreateModel.lastJoinDate = this.datePipe.transform(data.lastJoinDate, 'yyyy-MM-dd');
        this.duesCreateModel.executionDate = this.datePipe.transform(data.executionDate, 'yyyy-MM-dd');

      }
      this.calcDeusPeriod();
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  salaryMonthsChanged(valueIds: number[]) {
    var months = this.salaryDuesMonths.filter(x => valueIds.includes(x.id));
    var SalaryDuesMonthModel: SalaryDuesMonthModel[] = [];
    if (months?.length) {
      SalaryDuesMonthModel = months.map(month => {
        return {
          salaryMonth: month.month,
          salaryYear: month.year
        };
      });
      // SalaryDuesMonthModel.push({
      //   salaryMonth: month.month,
      //   salaryYear: month.year
      // });
    }
    this.duesCreateModel.salaryDuesMonths = SalaryDuesMonthModel;
  }
  calcDeusPeriod() {
    let date = new Date(this.duesCreateModel.executionDate);
    //date.setMonth(date.getMonth() - 1);
    const dues = getSalaryDuesMonths(this.duesCreateModel?.lastPaidSalaryMonth,
      this.duesCreateModel?.lastPaidSalaryYear,
      date.getMonth(),
      date.getFullYear());
    if (dues?.length) {
      this.salaryDuesMonths = dues;
      this.salaryMonthsSelector = dues.map(x => { return { value: x.id, name: x.monthYear } });
    }

    this.duesCreateModel.totalDuesMonths = 0;
    this.duesCreateModel.totalDuesDays = 0;
    let fromDate: Date | null = null;
    let toDate: Date | null = this.duesCreateModel.executionDate ? new Date(this.duesCreateModel.executionDate) : null;

    if (this.selectedDueTypeId === DueTypeEnum.Vacation) {
      fromDate = this.duesCreateModel.lastJoinDate ? new Date(this.duesCreateModel.lastJoinDate) : null;
    } else if (this.selectedDueTypeId === DueTypeEnum.EndOfService) {
      fromDate = this.duesCreateModel.joinDate ? new Date(this.duesCreateModel.joinDate) : null;
    }


    if (fromDate && toDate && fromDate <= toDate) {
      const start = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
      const end = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());

      let months =
        (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      let days = end.getDate() - start.getDate();

      if (days < 0) {
        months -= 1;
        const previousMonthDate = new Date(end.getFullYear(), end.getMonth(), 0); // last day of previous month
        days += previousMonthDate.getDate();
      }

      // Set to variables
      const month = months;
      const day = days;

      this.duesCreateModel.totalDuesMonths = month;
      this.duesCreateModel.totalDuesDays = day;
    }
  }

  calculateDues() {
    if (!this.checkEmployee())
      return;
    this.showLoader = true;
    this.hrService.calculateEmployeeDue(this.selectedEmployeeId, this.employeeDueModel).subscribe(data => {
      this.employeeDueModel = data;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  saveEmployeeDue() {
    if (!this.checkEmployee())
      return;
    this.duesCreateModel.dueTypeId =this.selectedDueTypeId;
    this.showLoader = true;
    this.hrService.saveEmployeeDue(this.selectedEmployeeId, this.duesCreateModel).subscribe(data => {
      if (data.isSuccess)
        this.toaster.success(data.message);
      else
        this.toaster.error(data.message);

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  checkEmployee() {
    if (!this.selectedEmployeeId) {
      this.toaster.warning('من فضلك اختر من قائمة الموظفين', 'تحذير');
      return false;
    }
    return true;
  }

  contractDetailsChanged(model: EmployeeContractModel) {
    this.selectedBranchId = model?.branchId ?? null;

  }
  getEmployeeDues() {
    if (!this.checkEmployee())
      return;
    this.showLoader = true;
    this.hrService.getEmployeeDues(this.selectedEmployeeId, this.pagedResponseModel).subscribe(data => {
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
  openSaveModal(content: any) {
    this.getEmployeeDuesPreparationDate();
    this.modalService.open(content, { centered: true, size: 'md' });
  }
  validateNumbers(key: any): boolean {
    let patt = /^([0-9\+])$/;
    let result = patt.test(key);
    return result;
  }
  calcTotalDues() {
    // this.employeeDueModel.totalDueAmount 
  }
}
