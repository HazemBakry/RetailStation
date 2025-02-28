import { Component, OnInit } from '@angular/core';
import { GeneralAccountService } from '../../services/general-account.service';
import { ToastrService } from 'ngx-toastr';
import { SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.css'],
})
export class TrialBalanceComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'ميزان المراجعة'];
  AccountsList: any[] = [];
  FromDate: any;
  ToDate: any;
  SearchResult: any[] = [];
  TotalCount: any;
  TotalPages: any;
  LevelNumber: any;
  HideEmptyAccounts: any;
  // LevelTypes: any[] = ['مجموعات وحسابات معاً', 'مجموعات', 'حسابات'];
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
      .GetTrialBalanceReport(this.SearchFilterModel)
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
      .ExportTrialBalanceReport(this.SearchFilterModel)
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
  onSearchClick(obj: any) {
    if (
      obj.FromDate == null ||
      obj.ToDate == null ||
      obj.BranchId == undefined
    ) {
      this.toaster.warning('Insert Search Fields First');
    } else {
      this.SearchFilterModel.branchID = obj.BranchId;
      this.SearchFilterModel.fromDate = obj.FromDate;
      this.SearchFilterModel.toDate = obj.ToDate;
      this.loadData();
    }
  }

  pageChanged(obj: any) {
    this.SearchFilterModel.currentPage = obj.page;
    this.loadData();
  }

  onExportClick(obj: any) {
    this.SearchFilterModel.branchID = obj.BranchId;
    this.SearchFilterModel.fromDate = obj.FromDate;
    this.SearchFilterModel.toDate = obj.ToDate;
    //this.SearchFilterModel.userName = this.UserModel?.fullName;
    this.SearchFilterModel.isExport = true;
    if (
      obj.FromDate == null ||
      obj.ToDate == null ||
      obj.BranchId == undefined
    ) {
      this.toaster.warning('insert search fields first');
    } else {
      // this.generalService
      //   .ExportAccountsGeneralLedger(this.SearchFilterModel)
      //   .subscribe((data) => {
      //     if (data.url != null) {
      //       window.location.href = data.url;
      //       this.toaster.success('File exported successfully');
      //     } else {
      //       this.toaster.error('an Error happened , file can not export');
      //     }
      //   });
    }
  }

  onPrintClick(obj: any) {
    // this.PrintList = this.DeliverySales;
    // this.PrintList.forEach(function (x) { delete x.matchCount, delete x.totalValue });
    // let headers = this.printToPdfService.MapColumnHeaders(Object.keys(this.PrintList[0]));
    // this.printToPdfService.GeneratePDF(obj,'Delivery Sales Report','landscape',this.PrintList,this.SalesSummaryStatistics,headers);
  }

  GetAccountNumberSelected(obj: any) {}

  GetAccountNameSelected(obj: any) {}

  GetTypeSelected(obj: any) {
    this.SearchFilterModel.searchType = obj.id;
  }
}

