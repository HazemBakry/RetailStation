import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { GeneralAccountService } from '../../services/general-account.service';

@Component({
  selector: 'app-cost-trial-balance',
  templateUrl: './cost-trial-balance.component.html',
  styleUrls: ['./cost-trial-balance.component.css']
})


export class CostTrialBalanceComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'ميزان مراجعة مراكز التكلفة'];

  SearchResult: any[] = [];
  TotalCount: any;
  TotalPages: any;
  LevelTypes: any[] = [];
  SearchFilterModel: SearchFilterModel = {
    currentPage: 1,
    pageSize: 25,
    isExport: false,
    filterItems: [],
    filterModel: { filterItems: [] },
  };

  constructor(
    private generalService: GeneralAccountService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.LevelTypes = this.generalService.searchTypeList;
  }

  loadData() {
    if (!this.validateSearchModel()) {
      return;
    }
    this.SearchFilterModel.isExport = false;

    this.generalService
      .GetCostTrialBalanceReport(this.SearchFilterModel)
      .subscribe((data) => {
        this.SearchResult = data;
        this.TotalCount =
          data &&
          data.length > 0 &&
          (data[0].matchCount != null || data[0].matchCount != undefined)
            ? data[0].matchCount
            : 0;
      });
  }
  exportData() {
    if (!this.validateSearchModel()) {
      return;
    }

    this.SearchFilterModel.isExport = true;
    this.generalService
      .ExportCostTrialBalanceReport(this.SearchFilterModel)
      .subscribe((data) => {
        if (data.url != null) {
          window.location.href = data.url;
          this.toaster.success('File exported successfully');
        } else {
          this.toaster.error('an Error happened , file can not export');
        }
      });
  }

  printData() {}

  headerSearchChanged(filter: SearchFilterModel) {
    this.SearchFilterModel.fromDate = filter.fromDate;
    this.SearchFilterModel.toDate = filter.toDate;
    
    this.SearchFilterModel.filterItems=[];
    this.SearchFilterModel.filterItems=filter.filterItems;
    

    this.SearchFilterModel.filterModel.filterItems =
      this.SearchFilterModel.filterItems = [
        ...new Set(this.SearchFilterModel.filterItems.map((item) => item)),
      ];
  }
  validateSearchModel(): boolean {
    if (
      !this.SearchFilterModel.fromDate ||
      !this.SearchFilterModel.toDate ||
      !this.SearchFilterModel.searchType ||
      !this.SearchFilterModel.searchLevel ||
      this.SearchFilterModel.filterItems.length == 0
    ) {
      this.toaster.warning('يرجي ملئ جميع الخانات');
      return false;
    }
    return true;
  }
  
  pageChanged(obj: any) {
    this.SearchFilterModel.currentPage = obj.page;
    this.loadData();
  }


  GetTypeSelected(obj: any) {
    this.SearchFilterModel.searchType = obj.id;
  }
}
