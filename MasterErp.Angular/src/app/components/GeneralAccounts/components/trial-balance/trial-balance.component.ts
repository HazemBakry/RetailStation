import { Component, OnInit } from '@angular/core';
import { GeneralAccountService } from '../../services/general-account.service';
import { ToastrService } from 'ngx-toastr';
import { SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { AccountsAssistantLedgerModel, AccountsReportSearchFilterModel, AccountsTrialBalanceModel } from '../../models/GeneralAccounts/AccountsReportSearchFilterModel';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';

@Component({
  selector: 'app-trial-balance',
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.css'],
})
export class TrialBalanceComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'ميزان المراجعة'];
  showLoader: boolean = false;
  showExportLoader: boolean = false;

  // LevelTypes: any[] = ['مجموعات وحسابات معاً', 'مجموعات', 'حسابات'];
  LevelNumber: any;
  levelTypesSelector: GeneralSelectorModel[] = [];
  totalDebit = null;
  totalCredit = null;
  trialBalanceResponse: AccountsReportSearchFilterModel = {
    results: [],
    filterList: [],
    pageSize: 10,
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
    this.generalService.GetAccountsTrialBalanceReport(this.trialBalanceResponse).subscribe((data: PagedResponseDTO<AccountsTrialBalanceModel[]>) => {
      this.trialBalanceResponse.results = data.results;
      this.trialBalanceResponse.totalCount = data.totalCount;

      if (this.trialBalanceResponse.results.length > 0) {
        this.totalDebit = this.trialBalanceResponse.results.reduce(
          (sum, x) => sum + (x.balanceDebit || 0),
          0
        );
        this.totalCredit = this.trialBalanceResponse.results.reduce(
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
    this.generalService.ExportAccountsTrialBalanceReport(this.trialBalanceResponse).subscribe((data: ActionsResponseModel) => {
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

    this.trialBalanceResponse.fromDate = filter.fromDate;
    this.trialBalanceResponse.toDate = filter.toDate;
    this.trialBalanceResponse.accountId = filter.accountId;
    this.trialBalanceResponse.costCenterId = filter.costCenterId;
  }
  pageChanged(obj: any) {
    this.trialBalanceResponse.currentPage = obj.page;
    this.loadData();
  }
  validateSearchModel(): boolean {
    if (
      !this.trialBalanceResponse.fromDate ||
      !this.trialBalanceResponse.toDate ||
      !this.trialBalanceResponse.searchType ||
      !this.trialBalanceResponse.searchLevel
    ) {
      this.toaster.warning('يرجي ملئ جميع الخانات');
      return false;
    }
    return true;
  }

}

