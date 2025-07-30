import { Component, OnInit } from '@angular/core';
import { EmployeeWeeklyShiftModel } from '../../models/EmployeeWeeklyShiftModel';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { FilterModel, FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { EmployeeAttendanceModel } from '../../models/EmployeeAttendanceModel';
import { HrService } from '../../services/hr.service';

@Component({
  selector: 'app-hr-weekly-shifts',
  templateUrl: './hr-weekly-shifts.component.html',
  styleUrls: ['./hr-weekly-shifts.component.css']
})
export class HrWeeklyShiftsComponent implements OnInit {

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
    pageSize: 10,
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
    // this.getEmployeeWeeklyShifts_Data();
    // this.GetEmployeeWeeklyShifts_Filters();
    // this.generateShifts();
    this.search();

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
    this.getEmployeeWeeklyShifts_Data();
  }
  getEmployeeWeeklyShifts_Data() {
    this.mapFilters();
    this.showLoader = true;
    this.hrService.GetEmployeeWeeklyShifts_Data(this.fromDate, this.toDate, this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data?.results;
      this.pagedResponseModel.totalCount = data?.totalCount;
      this.generateShifts();
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  GetEmployeeWeeklyShifts_Filters() {
    // this.hrService.GetEmployeeWeeklyShifts_Filters(this.pagedResponseModel).subscribe((data: FilterModel[]) => {
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
    this.getEmployeeWeeklyShifts_Data();
    this.GetEmployeeWeeklyShifts_Filters();
  }

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.getEmployeeWeeklyShifts_Data();
    this.GetEmployeeWeeklyShifts_Filters();
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



  weekDays = [
    { name: 'السبت', date: '2025-07-19' },
    { name: 'الأحد', date: '2025-07-20' },
    { name: 'الاثنين', date: '2025-07-21' },
    { name: 'الثلاثاء', date: '2025-07-22' },
    { name: 'الأربعاء', date: '2025-07-23' },
    { name: 'الخميس', date: '2025-07-24' },
    { name: 'الجمعة', date: '2025-07-25' },
  ];

  employees = [
    { employeeCode: '4182', employeeNameAR: 'Mohamed Haneef', employeeId: 1 },
    { employeeCode: '4466', employeeNameAR: 'mostafa shahemployeeIdul', employeeId: 2 },
    { employeeCode: '4534', employeeNameAR: 'MD ABDUL GAFFAR', employeeId: 3 },
    { employeeCode: '4562', employeeNameAR: 'MD Alamgir Hossain', employeeId: 4 },
    { employeeCode: '4590', employeeNameAR: 'khkon Rahul', employeeId: 5 }
  ];

  shifts: EmployeeWeeklyShiftModel[] = [];



  generateShifts(): void {
    for (const emp of this.pagedResponseModel.results) {
      for (const day of this.weekDays) {
        this.shifts.push({
          employeeWeeklyShiftId: null,
          employeeId: emp.employeeId,
          shiftDate: day.date,
          shiftOneFrom: '',
          shiftOneTo: '',
          shiftTwoFrom: '',
          shiftTwoTo: '',
          shiftType: '',
          isDayOff: false,
          isWeekend: false,
          notes: ''
        });
      }
    }
  }

  getShift(empId: number, date: string): EmployeeWeeklyShiftModel {
    return this.shifts.find(s => s.employeeId === empId && s.shiftDate === date)!;
    // return this.pagedResponseModel.results.find(s => s.employeeId === empId && s.shiftDate === date)!;
  }


}


