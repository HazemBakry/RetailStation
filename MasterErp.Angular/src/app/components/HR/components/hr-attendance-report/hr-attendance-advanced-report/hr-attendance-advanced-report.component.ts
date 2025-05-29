import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HrService } from '../../../services/hr.service';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FilterItem, FilterModel, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { EmployeeModel } from '../../../models/Employee/EmployeeModel';
import { Router } from '@angular/router';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { EmployeeAdvancedAttendanceModel } from '../../../models/EmployeeAttendanceModel';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';

@Component({
  selector: 'app-hr-attendance-advanced-report',
  templateUrl: './hr-attendance-advanced-report.component.html',
  styleUrls: ['./hr-attendance-advanced-report.component.css']
})
export class HrAttendanceAdvancedReportComponent implements OnInit {
  TitleList = ['الموارد البشرية', 'الحضور والانصراف'];
  URLs: any[] = [];
  Branches: any[] = [];
  branchSelectorData: GeneralSelectorModel[] = [];
  employeeSelectorData: GeneralSelectorModel[] = [];
  filterList: FilterModel[] = [];
  showLoader: boolean = false;

  fromDate: string;
  toDate: string;
  selectedEmployeeId: number;
  selectedBranchId: number;
  pagedResponseModel: PagedResponseDTO<EmployeeAdvancedAttendanceModel[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: ''
  };

  constructor(private modalService: NgbModal,
    private toaster: ToastrService,
    private hrService: HrService,
    private sharedService: SharedService,
    private router: Router) { }

  ngOnInit(): void {
    this.loadSelectors();
    // this.getAttendance_Data();
    // this.GetAttendance_Filters();

  }

  loadSelectors() {
    this.sharedService.GetBranchesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.branchSelectorData = data;
    });
    this.hrService.GetActiveEmployeesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.employeeSelectorData = data;
    });
  }
  headers: Date[] = [];
  search() {
    this.headers = [];
    var start = new Date(this.fromDate);
    var end = new Date(this.toDate);

    while (start <= end) {
      this.headers.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }

    this.pagedResponseModel.results = [];
    this.pagedResponseModel.currentPage = 1;
    this.pagedResponseModel.totalCount = 0;
    this.getAttendance_Data();
  }
  getAttendance_Data() {
    this.mapFilters();
    if (!this.fromDate || !this.toDate) {
      this.toaster.error('يرجى تحديد تاريخ البداية والنهاية');
      return;
    }
    if (this.fromDate > this.toDate) {
      this.toaster.error('يرجى تحديد تاريخ البداية والنهاية بشكل صحيح');
      return;
    }
    this.showLoader = true;
    this.hrService.GetAdvancedAttendanceReport_Data(this.fromDate, this.toDate, this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data?.results;
      this.pagedResponseModel.totalCount = data?.totalCount;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  getPunchInfo(employee: EmployeeAdvancedAttendanceModel, date: Date): string {
    // const dateKey = date.toISOString().split('T')[0];
    const dateKey = date.toLocaleDateString().split('T')[0];
    const record = employee.attendance?.find(a =>
      a.attendanceDate && new Date(a.attendanceDate).toLocaleDateString().split('T')[0] === dateKey
    );

    if (!record) return '-';
    return record.attendanceStatusCode;
  }
  GetAttendance_Filters() {
    // this.hrService.GetAttendance_Filters(this.pagedResponseModel).subscribe((data: FilterModel[]) => {
    //   this.filterList = data;
    // }, (err) => {
    //   // this.showLoader = false;
    // }, () => {
    //   // this.showLoader = false;
    // });
  }
  mapFilters() {
    this.pagedResponseModel.filterList = [];
    if (this.fromDate) {
      this.pagedResponseModel.filterList.push({ categoryName: 'FromDate', itemFlag: this.fromDate })
    }
    if (this.toDate) {
      this.pagedResponseModel.filterList.push({ categoryName: 'ToDate', itemFlag: this.toDate })
    }
    if (this.selectedEmployeeId) {
      this.pagedResponseModel.filterList.push({ categoryName: 'EmployeeId', itemFlag: this.selectedEmployeeId?.toString() })
    }
    if (this.selectedBranchId) {
      this.pagedResponseModel.filterList.push({ categoryName: 'BranchId', itemFlag: this.selectedBranchId?.toString() })
    }
  }
  goToEmployeeDetails(employeeId: any) {
    this.router.navigateByUrl('/hr/employee-details?EmployeeId=' + employeeId);
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getAttendance_Data();
    this.GetAttendance_Filters();
  }

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.getAttendance_Data();
    this.GetAttendance_Filters();
  }

  getTime(currentT?: any, upcomingT?: any, getColorClass: boolean = false) {
    if (!currentT || !upcomingT) {
      return '';
    }
    const currentTime = new Date(currentT);
    const upcomingTime = new Date(upcomingT)

    if (currentTime && upcomingTime) {
      const timeDifference = upcomingTime.getTime() - currentTime.getTime();
      // const differenceDate = new Date(timeDifference);

      const hours = Math.floor(timeDifference / 3600000); // 1 hour = 3600000 milliseconds
      const minutes = Math.floor((timeDifference % 3600000) / 60000); // 1 minute = 60000 milliseconds
      const seconds = Math.floor((timeDifference % 60000) / 1000); // 1 second = 1000 milliseconds

      if (getColorClass) {
        if (minutes <= 30 && hours < 1)
          return 'txt-success';
        else if (minutes > 30 && hours < 1)
          return 'txt-warning'
        else if (hours >= 1)
          return 'txt-danger';
      }
      return `${hours} ساعة: ${minutes} دقيقة`;
      // return `${hours} h : ${minutes} m : ${seconds} s`;

    }
    return '';
  }

  getTimeFromSec(totalSeconds: number) {

    if (totalSeconds && totalSeconds) {
      const timeDifference = totalSeconds * 1000;
      // const differenceDate = new Date(timeDifference);

      const hours = Math.floor(timeDifference / 3600000); // 1 hour = 3600000 milliseconds
      const minutes = Math.floor((timeDifference % 3600000) / 60000); // 1 minute = 60000 milliseconds
      const seconds = Math.floor((timeDifference % 60000) / 1000); // 1 second = 1000 milliseconds

      // if (minutes <= 30 && hours < 1)
      //   return 'txt-success';
      // else if (minutes > 30 && hours < 1)
      //   return 'txt-warning'
      // else if (hours >= 1)
      //   return 'txt-danger';


      return `${hours} ساعة: ${minutes} دقيقة`;
      // return `${hours} h : ${minutes} m : ${seconds} s`;

    }
    return '';
  }
  getSelectedBranch(branch) {
    //this.selectedAgencyType = accountType;
    //this.receiptModel.agencyTypeId = accountType;
  }
  getAttendanceBgClass(code: string): string {
    switch (code) {
      case 'P': return 'bg-present';
      case 'O': return 'bg-off';
      case 'A': return 'bg-absent';
      case 'S': return 'bg-sick';
      case 'E': return 'bg-excused';
      default: return '';
    }
  }

  openApproveAttendanceModal(content: any) {

    this.modalService.open(content, { centered: true, size: 'md' });
  }
  approveAttendance() {
    this.showLoader = true;
    this.mapFilters();
    if (!this.fromDate || !this.toDate) {
      this.toaster.error('يرجى تحديد تاريخ البداية والنهاية');
      this.showLoader = false;
      return;
    }
    this.hrService.ApproveEmployeesAttendance(this.fromDate, this.toDate, this.pagedResponseModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.toaster.success(data?.message);

      }
      else {
        this.toaster.error(data?.message);
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

}

