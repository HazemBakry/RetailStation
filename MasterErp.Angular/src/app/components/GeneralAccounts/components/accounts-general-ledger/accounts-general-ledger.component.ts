import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { GeneralAccountService } from '../../services/general-account.service';
import { AccountsGeneralLedgerModel, AccountsReportSearchFilterModel } from '../../models/GeneralAccounts/AccountsReportSearchFilterModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { SharedService } from 'src/app/components/Shared/services/shared.service';

@Component({
  selector: 'app-accounts-general-ledger',
  templateUrl: './accounts-general-ledger.component.html',
  styleUrls: ['./accounts-general-ledger.component.css']
})
export class AccountsGeneralLedgerComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'دفتر الأستاذ العام'];

  
  showLoader: boolean = false;
  showExportLoader: boolean = false;
  totalDebit = null;
  totalCredit = null;
  ledgersResponse: AccountsReportSearchFilterModel = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: '',
    hideEmptyAccounts: false,
    accountId: null,
    fromDate: null,
    toDate: null

  };
  constructor(private generalService: GeneralAccountService,private sharedService:SharedService, private toaster: ToastrService) { }

  ngOnInit(): void {
  }

  loadData() {
    if (!this.validateSearchModel()) {
      return;
    }
    //this.SearchFilterModel.isExport = false;
    this.showLoader=true;
    this.totalDebit = null;
    this.totalCredit = null;
    this.generalService.GetAccountsGeneralLedger(this.ledgersResponse).subscribe((data: PagedResponseDTO<AccountsGeneralLedgerModel[]>) => {
      this.ledgersResponse.results = data.results;
      this.ledgersResponse.totalCount = data.totalCount;
      var baseAccount = this.ledgersResponse.results?.find(x=>x.accountId==this.ledgersResponse.accountId);

      if(baseAccount)
      {
        this.totalDebit = baseAccount.totalDebit;
        this.totalCredit = baseAccount.totalCredit;
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  // exportData() {
  //   if (!this.validateSearchModel()) {
  //     return;
  //   }
  //   // this.SearchFilterModel.isExport = true;

  //   this.generalService.ExportAccountsGeneralLedger(this.ledgersResponse).subscribe(data => {
  //     if (data.url != null) {
  //       window.location.href = data.url;
  //       this.toaster.success("File exported successfully");
  //     } else {
  //       this.toaster.error("an Error happened , file can not export");
  //     }
  //   });
  // }
  exportData() {
    if (!this.validateSearchModel()) {
      return;
    }
    this.showExportLoader = true;
    this.generalService.ExportAccountsGeneralLedger(this.ledgersResponse).subscribe((data: ActionsResponseModel) => {
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


  searchDataChanged(filter: AccountsReportSearchFilterModel) {

    this.ledgersResponse.fromDate = filter.fromDate;
    this.ledgersResponse.toDate = filter.toDate;
    this.ledgersResponse.accountId = filter.accountId;
    this.ledgersResponse.costCenterId = filter.costCenterId;
  }
  pageChanged(obj: any) {
    this.ledgersResponse.currentPage = obj.page;
    this.loadData();
  }
  validateSearchModel(): boolean {
    // this.ledgersResponse.filterList =[];
    // this.ledgersResponse.filterList.push({categoryName:'accountId',itemFlag:'1'})
    // this.ledgersResponse.fromDate = new Date('2025-01-01').toLocaleDateString();
    // this.ledgersResponse.toDate = new Date().toLocaleDateString();
    if (
      !this.ledgersResponse.fromDate ||
      !this.ledgersResponse.toDate ||
      !this.ledgersResponse.accountId
    ) {
      this.toaster.warning('يرجي ملئ جميع الخانات');
      return false;
    }
    return true;
  }
  // onSearchClick(obj: any) {
  //   if (obj.FromDate == null || obj.ToDate == null || obj.BranchId == undefined) {
  //     this.toaster.warning('Insert Search Fields First');
  //   } else {
  //     this.SearchFilterModel.branchID = obj.BranchId;
  //     this.SearchFilterModel.fromDate = obj.FromDate;
  //     this.SearchFilterModel.toDate = obj.ToDate;
  //     this.loadData();
  //   }
  // }

  // onExportClick(obj: any) {
  //   this.SearchFilterModel.branchID = obj.BranchId;
  //   this.SearchFilterModel.fromDate = obj.FromDate;
  //   this.SearchFilterModel.toDate = obj.ToDate;
  //   //this.SearchFilterModel.userName = this.UserModel?.fullName;
  //   this.SearchFilterModel.isExport = true;
  //   if (obj.FromDate == null || obj.ToDate == null || obj.BranchId == undefined) {
  //     this.toaster.warning('insert search fields first');
  //   } else {
  //     this.generalService.ExportAccountsGeneralLedger(this.SearchFilterModel).subscribe(data => {
  //       if (data.url != null) {
  //         window.location.href = data.url;
  //         this.toaster.success("File exported successfully");
  //       } else {
  //         this.toaster.error("an Error happened , file can not export");
  //       }
  //     });
  //   }
  // }

  onPrintClick(obj: any) {
    // this.PrintList = this.DeliverySales;
    // this.PrintList.forEach(function (x) { delete x.matchCount, delete x.totalValue });
    // let headers = this.printToPdfService.MapColumnHeaders(Object.keys(this.PrintList[0]));
    // this.printToPdfService.GeneratePDF(obj,'Delivery Sales Report','landscape',this.PrintList,this.SalesSummaryStatistics,headers);
  }
}
