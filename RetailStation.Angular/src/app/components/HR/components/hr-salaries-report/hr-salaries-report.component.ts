import { Component, OnInit } from '@angular/core';
import { FilterItem, FilterModel, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { HrService } from '../../services/hr.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';

@Component({
  selector: 'app-hr-salaries-report',
  templateUrl: './hr-salaries-report.component.html',
  styleUrls: ['./hr-salaries-report.component.css']
})

export class HRSalariesReportComponent implements OnInit {
  TitleList = ['الموارد البشرية', 'تقرير الرواتب الشهرية'];
  showLoader: boolean = false;
  showExportLoader: boolean = false;
  filterList: FilterModel[] = [];
  yearsSelectorData: GeneralSelectorModel[] = [];
  arabicMonths = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];
  monthsSelectorData: GeneralSelectorModel[] = this.arabicMonths.map((name, index) => ({
    value: index + 1,
    name
  }));
  selectedYear: number;
  selectedMonth: number;

  pagedResponseModel: PagedResponseDTO<SearchFilterModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: '',
    fromDate: '',
    toDate: ''
  };

  constructor(private hrService: HrService,
    private sharedService: SharedService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    // this.getSalarySummary_Data();
    //this.getSalaryReport_Filters();
    this.load_Selectors();
  }

  load_Selectors() {
    const currentYear = new Date().getFullYear();
    this.selectedYear = currentYear;
    for (let i = currentYear - 5; i <= currentYear; i++) {
      this.yearsSelectorData.push({ value: i, name: i });
    }
    this.yearsSelectorData.reverse();
  }

  searchData() {
    if (!this.selectedMonth || !this.selectedYear) {
      this.toaster.error('You must select year and month first');
      return
    }
    else {
      this.getSalaryReport_Data();
      this.getSalaryReport_Filters();
    }
  }

  getSalaryReport_Data() {
    this.showLoader = true;
    this.hrService.GetSalariesReport_Data(this.selectedMonth, this.selectedYear, this.pagedResponseModel).subscribe((data: PagedResponseDTO<SearchFilterModel[]>) => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  getSalaryReport_Filters() {
    this.hrService.GetSalariesReport_Filters(this.selectedMonth, this.selectedYear, this.pagedResponseModel).subscribe((data: FilterModel[]) => {
      this.filterList = data;
    }, (err) => {
      // this.showLoader = false;
    }, () => {
      // this.showLoader = false;
    });
  }

  exportData() {
    this.showExportLoader = true;
    this.hrService.GetSalariesReport_Export(this.selectedMonth, this.selectedYear, this.pagedResponseModel).subscribe((data: ActionsResponseModel) => {
      if (data.isSuccess) {
        this.sharedService.urlDownloadOrOpen(data.url);
        this.toaster.success(data.message);
      } else {
        this.toaster.error(data.message);
      }

      this.showExportLoader = false;
    }, err => {
      this.showExportLoader = false;
    }, () => {
      this.showExportLoader = false;
    });
  }

  printData() {

  }


  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.getSalaryReport_Data();
    //this.getSalaryReport_Filters();
  }

  searchDataChanged(filter: SearchFilterModel) {
    this.pagedResponseModel.fromDate = filter.fromDate;
    this.pagedResponseModel.toDate = filter.toDate;
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.getSalaryReport_Data();
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