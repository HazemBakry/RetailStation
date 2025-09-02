import { Component, OnInit } from '@angular/core';
import { EmployeeWeeklyShiftModel, ShiftModel } from '../../models/EmployeeWeeklyShiftModel';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { FilterModel, FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
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
  showAddLoader: boolean = false;

  fromDate: string;
  toDate: string;
  selectedEmployeeId: number;
  selectedBranchId: number;
  pagedResponseModel: PagedResponseDTO<EmployeeWeeklyShiftModel[]> = {
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
    this.refreshWeekDays();
    this.loadSelectors();
    // this.getEmployeeWeeklyShifts_Data();
    // this.GetEmployeeWeeklyShifts_Filters();
    // this.refreshWeekDays();


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
      // this.refreshWeekDays();
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
  weekDays: WeekDay[] = [];
  currentWeekOffset = 0; // Tracks current week (0 = current, +1 = next week, -1 = prev week)
  selectedWeekStartDay: WeekDay = { name: '', date: '' };
  shifts: EmployeeWeeklyShiftModel[] = [];
  // Generate weekDays array starting from the upcoming Saturday
  refreshWeekDays(): void {
    const daysArabic = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
    this.weekDays = [];

    // Get the reference Saturday (today + offset in weeks)
    const referenceDate = new Date();
    referenceDate.setDate(referenceDate.getDate() + (this.currentWeekOffset * 7));

    // Find the closest Saturday (if not already Saturday)
    const nextSaturday = new Date(referenceDate);
    nextSaturday.setDate(referenceDate.getDate() + (6 - referenceDate.getDay() + 1) % 7);

    // Generate 7 days starting from that Saturday
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(nextSaturday);
      currentDate.setDate(nextSaturday.getDate() + i);

      this.weekDays.push({
        name: daysArabic[i],
        date: currentDate.toISOString().split('T')[0]
      });
    }
    this.selectedWeekStartDay = this.weekDays[0];
    this.fromDate = this.weekDays[0].date;
    this.toDate = this.weekDays[6].date;
    this.search();
  }

  // Generate shifts for the current week
  // generateShifts(): void {
  //   this.shifts = [];
  //   this.refreshWeekDays(); // Ensure weekDays is up-to-date

  //   for (const emp of this.pagedResponseModel.results) {
  //     for (const day of this.weekDays) {
  //       this.shifts.push({
  //         employeeWeeklyShiftId: null,
  //         employeeId: emp.employeeId,
  //         shiftDate: day.date,
  //         shiftOneFrom: '',
  //         shiftOneTo: '',
  //         shiftTwoFrom: '',
  //         shiftTwoTo: '',
  //         shiftType: '',
  //         isDayOff: false,
  //         isWeekend: false,
  //         notes: ''
  //       });
  //     }
  //   }
  // }

  // Go to next week
  nextWeek(): void {
    this.currentWeekOffset += 1;
    this.refreshWeekDays();
  }

  // Go to previous week
  prevWeek(): void {
    this.currentWeekOffset -= 1;
    this.refreshWeekDays();
  }


  // refreshWeekDays(): void {
  //   for (const emp of this.pagedResponseModel.results) {
  //     for (const day of this.weekDays) {
  //       this.shifts.push({
  //         employeeWeeklyShiftId: null,
  //         employeeId: emp.employeeId,
  //         shiftDate: day.date,
  //         shiftOneFrom: '',
  //         shiftOneTo: '',
  //         shiftTwoFrom: '',
  //         shiftTwoTo: '',
  //         shiftType: '',
  //         isDayOff: false,
  //         isWeekend: false,
  //         notes: ''
  //       });
  //     }
  //   }
  // }

  getShift(empId: number, dateInput: string | Date): ShiftModel {
    const date = new Date(dateInput);
    const dateString = date.toISOString().split('T')[0];

    const employee = this.pagedResponseModel.results.find(s => s.employeeId === empId);
    if (!employee) {
      return null
    }

    // Initialize weekShifts if it doesn't exist
    if (!employee.weekShifts) {
      employee.weekShifts = [];
    }

    // Find existing shift by comparing date parts only
    const existingShift = employee.weekShifts.find(s => {
      const shiftDate = new Date(s.shiftDate).toISOString().split('T')[0];
      return shiftDate === dateString;
    });
    if (existingShift) {
      return existingShift;
    }
    // Create and add new shift if none exists
    const newShift = this.createEmptyShift(empId, dateString);
    employee.weekShifts.push(newShift);
    return newShift;
  }

  createEmptyShift(empId: number, date: string): ShiftModel {
    return {
      employeeWeeklyShiftId: null,
      employeeId: empId,
      shiftDate: date,
      shiftOneFrom: null,
      shiftOneTo: null,
      shiftTwoFrom: null,
      shiftTwoTo: null,
      notes: ''
    };
  }

  saveEmployeeShifts() {
    if (!this.validateShifts()) {
      return;
    }

    this.showAddLoader = true;
    this.hrService.SaveEmployeeShifts(this.pagedResponseModel.results).subscribe(response => {
      if (response.isSuccess) {
        this.toaster.success(response.message);
        this.getEmployeeWeeklyShifts_Data(); // Refresh data after saving
      } else {
        this.toaster.error(response.message);
      }
    },
      (err) => {
        this.toaster.error('حدث خطأ أثناء حفظ البيانات');
        console.error('Error saving shifts:', err);
      },
      () => {
        this.showAddLoader = false;
      }
    );
  }

  // Validation method
  private validateShifts(): boolean {
    if (!this.pagedResponseModel?.results?.length) {
      this.toaster.warning('لا يوجد بيانات موظفين لحفظها', 'تحذير');
      return false;
    }

    let isValid = true;
    const errors: string[] = [];

    this.pagedResponseModel.results.forEach(employee => {
      if (!employee.weekShifts?.length) {
        errors.push(`لا يوجد نوبات عمل للموظف ${employee.employeeNameAR}`);
        isValid = false;
        return;
      }

      employee.weekShifts.forEach(shift => {
        // Validate shift times
        if (shift.shiftOneFrom && shift.shiftOneTo &&
          new Date(`1970-01-01T${shift.shiftOneTo}`) <= new Date(`1970-01-01T${shift.shiftOneFrom}`)) {
          errors.push(`وقت نهاية النوبة الأولى يجب أن يكون بعد وقت البداية للموظف ${employee.employeeNameAR} في تاريخ ${shift.shiftDate}`);
          isValid = false;
        }

        if (shift.shiftTwoFrom && shift.shiftTwoTo &&
          new Date(`1970-01-01T${shift.shiftTwoTo}`) <= new Date(`1970-01-01T${shift.shiftTwoFrom}`)) {
          errors.push(`وقت نهاية النوبة الثانية يجب أن يكون بعد وقت البداية للموظف ${employee.employeeNameAR} في تاريخ ${shift.shiftDate}`);
          isValid = false;
        }
      });
    });

    if (errors.length > 0) {
      errors.forEach(error => this.toaster.warning(error, 'تحذير'));
    }

    return isValid;
  }
  // Helper method to format time for display
  formatTime(timeString: string | null): string {
    if (!timeString) return '';
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }


}

export class WeekDay { name: string; date: string }
