import { Component, OnInit } from '@angular/core';
import { GeneralAccountService } from '../../services/general-account.service';
import { ToastrService } from 'ngx-toastr';
import { AccountsReportSearchFilterModel, AccountsBalanceSheetModel } from '../../models/GeneralAccounts/AccountsReportSearchFilterModel';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.css'],
})
export class BalanceSheetComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'المركز المالى'];
  showLoader: boolean = false;
  showExportLoader: boolean = false;

  // LevelTypes: any[] = ['مجموعات وحسابات معاً', 'مجموعات', 'حسابات'];
  LevelNumber: any;
  levelTypesSelector: GeneralSelectorModel[] = [];
  totalDebit = null;
  totalCredit = null;
  balanceSheetResponse: AccountsReportSearchFilterModel = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: '',
    hideEmptyAccounts: false,
    accountId: null,
    searchType: null,
    searchLevel: null,
    fromDate: null,
    toDate: null

  };

  constructor(private generalService: GeneralAccountService, private sharedService: SharedService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.levelTypesSelector = this.generalService.searchTypeList.map(type => {
      return {
        value: type.id,
        name: type.nameAR ?? type.nameEN
      };
    });
  }

  loadData() {
    if (!this.validateSearchModel()) {
      return;
    }
    this.totalDebit = null;
    this.totalCredit = null;
    this.showLoader = true;
    this.generalService.GetAccountsBalanceSheetReport(this.balanceSheetResponse).subscribe((data: PagedResponseDTO<AccountsBalanceSheetModel[]>) => {
      this.balanceSheetResponse.results = data.results;
      this.balanceSheetResponse.totalCount = data.totalCount;

      if (this.balanceSheetResponse.results.length > 0) {
        this.totalDebit = this.balanceSheetResponse.results.reduce(
          (sum, x) => sum + (x.balanceDebit || 0),
          0
        );
        this.totalCredit = this.balanceSheetResponse.results.reduce(
          (sum, x) => sum + (x.balanceCredit || 0),
          0
        );
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  exportData() {
    if (!this.validateSearchModel()) {
      return;
    }
    this.showExportLoader = true;
    this.generalService.ExportAccountsBalanceSheetReport(this.balanceSheetResponse).subscribe((data: ActionsResponseModel) => {
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

    this.balanceSheetResponse.fromDate = filter.fromDate;
    this.balanceSheetResponse.toDate = filter.toDate;
    this.balanceSheetResponse.accountId = filter.accountId;
    this.balanceSheetResponse.costCenterId = filter.costCenterId;
  }
  pageChanged(obj: any) {
    this.balanceSheetResponse.currentPage = obj.page;
    this.loadData();
  }
  validateSearchModel(): boolean {
    if (
      !this.balanceSheetResponse.fromDate ||
      !this.balanceSheetResponse.toDate ||
      !this.balanceSheetResponse.searchType ||
      !this.balanceSheetResponse.searchLevel
    ) {
      this.toaster.warning('يرجي ملئ جميع الخانات');
      return false;
    }
    return true;
  }

}

