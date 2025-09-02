import { Component, OnInit } from '@angular/core';
import { FilterItem, FilterModel, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { HrService } from '../../services/hr.service';

@Component({
  selector: 'app-hr-employees-report',
  templateUrl: './hr-employees-report.component.html',
  styleUrls: ['./hr-employees-report.component.css']
})

export class HREmployeesReportComponent implements OnInit {
  TitleList = ['الموارد البشرية', 'تقرير بيانات الموظفين'];
  showLoader: boolean = false;
  showExportLoader: boolean = false;
  filterList: FilterModel[] = [];
  fromDate: string;
  toDate: string;
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
    //this.getEmployeesSummary_Data();
    //this.GetEmployeesSummary_Filters();
  }

  getEmployeesSummary_Data() {
    this.showLoader = true;
    if (this.fromDate) {
      this.pagedResponseModel.filterList.push({ categoryName: 'FromDate', itemFlag: this.fromDate })
    }
    if (this.toDate) {
      this.pagedResponseModel.filterList.push({ categoryName: 'ToDate', itemFlag: this.toDate })
    } 
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
    if (this.fromDate) {
      this.pagedResponseModel.filterList.push({ categoryName: 'FromDate', itemFlag: this.fromDate })
    }
    if (this.toDate) {
      this.pagedResponseModel.filterList.push({ categoryName: 'ToDate', itemFlag: this.toDate })
    } 
    this.hrService.GetEmployeesSummary_Filters(this.pagedResponseModel).subscribe((data: FilterModel[]) => {
      this.filterList = data;
    }, (err) => {
      // this.showLoader = false;
    }, () => {
      // this.showLoader = false;
    });
  }

  searchData(){
    this.getEmployeesSummary_Data();
    this.GetEmployeesSummary_Filters();
  }

  exportData() {
    this.showExportLoader = true;
    if (this.fromDate) {
      this.pagedResponseModel.filterList.push({ categoryName: 'FromDate', itemFlag: this.fromDate })
    }
    if (this.toDate) {
      this.pagedResponseModel.filterList.push({ categoryName: 'ToDate', itemFlag: this.toDate })
    } 
    this.hrService.ExportEmployeesSummaryData(this.pagedResponseModel).subscribe((data: ActionsResponseModel) => {
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

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.getEmployeesSummary_Data();
    this.GetEmployeesSummary_Filters();
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