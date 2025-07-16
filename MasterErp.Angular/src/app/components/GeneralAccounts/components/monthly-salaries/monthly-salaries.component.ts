import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { HrService } from 'src/app/components/HR/services/hr.service';
import { EmployeeSalarySummaryModel } from 'src/app/components/HR/models/EmployeeSalarySummaryModel';

@Component({
  selector: 'app-monthly-salaries',
  templateUrl: './monthly-salaries.component.html',
  styleUrls: ['./monthly-salaries.component.css']
})
export class MonthlySalariesComponent implements OnInit {

  TitleList = ['الموارد البشرية', 'الرواتب الشهرية'];
  URLs: any[] = [];
  Branches: any[] = [];
  branchSelectorData: GeneralSelectorModel[] = [];
  employeeSelectorData: GeneralSelectorModel[] = [];
  yearsSelectorData: GeneralSelectorModel[] = [];
  selectAll: boolean = false;
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
  showExportLoader: boolean = false;
  showAddLoader: boolean = false;

  selectedYear: number;
  selectedMonth: number;
  selectedEmployeeId: number;
  selectedBranchId: number;
  bankAccounts: GeneralSelectorModel[] = [];
  cashAccounts: GeneralSelectorModel[] = [];
  bankAccountId: number;
  cashAccountId: number;
  totalSummary: any;
  pagedResponseModel: PagedResponseDTO<EmployeeSalarySummaryModel[]> = {
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

    //onChoosePaymentType(paymentTypeId: number) {
    //if (paymentTypeId == 1) {
    this.sharedService.GetAccountsByTypeId(3).subscribe(data => {
      this.bankAccounts = data;
    });
    // }
    // else {
    this.sharedService.GetAccountsByTypeId(4).subscribe(data => {
      this.cashAccounts = data;
    });
    //}


    const currentYear = new Date().getFullYear();
    this.selectedYear = currentYear;
    for (let i = currentYear - 5; i <= currentYear; i++) {
      this.yearsSelectorData.push({ value: i, name: i });
    }
    this.yearsSelectorData.reverse();
  }

  search() {
    this.pagedResponseModel.results = [];
    this.pagedResponseModel.currentPage = 1;
    this.pagedResponseModel.totalCount = 0;
    this.getSalaries_Data();
  }

  getSalaries_Data() {
    this.mapFilters();
    if (!this.selectedYear || !this.selectedMonth) {
      this.toaster.error('يرجى تحديد السنة والشهر');
      return;
    }
    this.showLoader = true;
    this.hrService.GetEmployeeSalarySummary(this.selectedYear, this.selectedMonth, this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data?.results;
      this.pagedResponseModel.totalCount = data?.totalCount;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  selectAllData() {
    if (this.pagedResponseModel.results && this.pagedResponseModel.results.length > 0) {
      this.pagedResponseModel.results.map(c => {
        c.isChecked = this.selectAll;
      });
    }
  }

  exportData() {
    this.mapFilters();
    if (!this.selectedYear || !this.selectedMonth) {
      this.toaster.error('يرجى تحديد السنة والشهر');
      return;
    }
    this.showExportLoader = true;
    this.hrService.GetEmployeeSalarySummary_Export(this.selectedYear, this.selectedMonth, this.pagedResponseModel).subscribe(data => {
      if (data.isSuccess) {
        this.sharedService.urlDownloadOrOpen(data.url);
        this.toaster.success(data.message);
      } else {
        this.toaster.error(data.message);
      }
    }, err => {
      this.showExportLoader = false;
    }, () => {
      this.showExportLoader = false;
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
    this.getSalaries_Data();
  }


  openSaveModal(content: any, isApprove: boolean = true) {
    this.mapFilters();
    if (!this.selectedYear || !this.selectedMonth) {
      this.toaster.error('يرجى تحديد السنة والشهر');
      return;
    }
    this.modalService.open(content, { centered: true, size: 'md' });
  }
  approve() {

    this.showAddLoader = true;
    this.hrService.ApproveMonthlySalary(this.selectedYear, this.selectedMonth, this.pagedResponseModel).subscribe((data: ActionsResponseModel) => {
      if (data.isSuccess) {
        this.search();
        this.toaster.success(data.message);
      }
      else {
        this.toaster.error(data.message);
      }
      this.showAddLoader = false;
    }, (err) => {
      this.showAddLoader = false;
    }, () => {
      this.showAddLoader = false;
    });
  }
}
