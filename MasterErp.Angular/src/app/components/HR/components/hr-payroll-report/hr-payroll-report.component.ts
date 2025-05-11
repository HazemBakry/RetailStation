import { Component, OnInit } from '@angular/core';
import { FilterItem, FilterModel, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { HrService } from '../../services/hr.service';

@Component({
  selector: 'app-hr-payroll-report',
  templateUrl: './hr-payroll-report.component.html',
  styleUrls: ['./hr-payroll-report.component.css']
})

export class HRPayrollReportComponent implements OnInit {
  showLoader: boolean = false;
  showExportLoader: boolean = false;
  filterList: FilterModel[] = [];
  TitleList = ['الموارد البشرية', 'Payroll'];
  payrollProcessTypes: any[] = [];

  pagedResponseModel: PagedResponseDTO<SearchFilterModel[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: '',
    fromDate: '',
    toDate: ''
  };


  constructor(private hrService: HrService,
    private sharedService: SharedService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getEmployeesSummary_Data();
    this.GetEmployeesSummary_Filters();
    this.payrollProcessTypes = this.hrService.payrollProcessTypes;

  }

  getEmplyeePayrollReport(type: any) {
    debugger;
    this.showLoader = true;
    this.hrService.getEmplyeePayrollReport(type, this.pagedResponseModel).subscribe(data => {
      debugger;
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  getEmployeesSummary_Data() {
    // if (!this.validateSearchModel()) {
    //   return;
    // }

    this.showLoader = true;
    this.hrService.GetEmployeesSummary_Data(this.pagedResponseModel).subscribe((data: PagedResponseDTO<SearchFilterModel[]>) => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  GetEmployeesSummary_Filters() {
    this.hrService.GetEmployeesSummary_Filters(this.pagedResponseModel).subscribe((data: FilterModel[]) => {
      this.filterList = data;
    }, (err) => {
      // this.showLoader = false;
    }, () => {
      // this.showLoader = false;
    });
  }

  exportData() {
    // if (!this.validateSearchModel()) {
    //   return;
    // }
    // this.showExportLoader = true;
    // this.hrService.ExportCostGeneralLedger(this.ledgersResponse).subscribe((data: ActionsResponseModel) => {
    //   if (data.isSuccess) {
    //     this.sharedService.urlDownloadOrOpen(data.url);
    //     this.toaster.success(data.message);
    //   } else {
    //     this.toaster.error(data.message);
    //   }

    //   this.showExportLoader = false;
    // }, err => {
    //   this.showExportLoader = false;
    // }, () => {
    //   this.showExportLoader = false;
    // });
  }

  printData() {

  }


  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.getEmployeesSummary_Data();
    //this.GetEmployeesSummary_Filters();
  }

  searchDataChanged(filter: SearchFilterModel) {
    this.pagedResponseModel.fromDate = filter.fromDate;
    this.pagedResponseModel.toDate = filter.toDate;
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getEmployeesSummary_Data();
  }

  validateSearchModel(): boolean {
    if (
      !this.pagedResponseModel.fromDate ||
      !this.pagedResponseModel.toDate
    ) {
      this.toaster.warning('يرجي ملئ جميع الخانات');
      return false;
    }
    return true;
  }

}