import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { HrService } from '../../../services/hr.service';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FilterItem, FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { Router } from '@angular/router';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { EmployeeAttendanceModel } from '../../../models/EmployeeAttendanceModel';

@Component({
  selector: 'app-hr-daily-attendance-report',
  templateUrl: './hr-daily-attendance-report.component.html',
  styleUrls: ['./hr-daily-attendance-report.component.css']
})
export class HrDailyAttendanceReportComponent implements OnInit {
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
  pagedResponseModel: PagedResponseDTO<EmployeeAttendanceModel[]> = {
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
  search() {
    this.pagedResponseModel.results = [];
    this.pagedResponseModel.currentPage = 1;
    this.pagedResponseModel.totalCount = 0;
    this.getAttendance_Data();
  }
  getAttendance_Data() {
    this.mapFilters();
    this.showLoader = true;
    this.hrService.GetAttendanceReport_Data(this.fromDate,this.toDate,this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data?.results;
      this.pagedResponseModel.totalCount = data?.totalCount;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
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
    if (!currentT||!upcomingT) {
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

}

