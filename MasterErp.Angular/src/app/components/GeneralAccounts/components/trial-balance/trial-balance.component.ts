import { Component, OnInit } from '@angular/core';
import { GeneralAccountService } from '../../services/general-account.service';
import { ToastrService } from 'ngx-toastr';
import { SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { AccountsAssistantLedgerModel, AccountsReportSearchFilterModel, TrialBalanceModel } from '../../models/GeneralAccounts/AccountsReportSearchFilterModel';
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

  trialBalanceResponse: AccountsReportSearchFilterModel = {
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

    this.showLoader = true;
    this.generalService.GetTrialBalanceReport(this.trialBalanceResponse).subscribe((data: PagedResponseDTO<TrialBalanceModel[]>) => {
      this.trialBalanceResponse.results = data.results;
      this.trialBalanceResponse.totalCount = data.totalCount;

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
    this.generalService.ExportTrialBalanceReport(this.trialBalanceResponse).subscribe((data: ActionsResponseModel) => {
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
      !this.trialBalanceResponse.accountId
      // this.SearchFilterModel.searchType ||
      // !this.SearchFilterModel.searchLevel
    ) {
      this.toaster.warning('يرجي ملئ جميع الخانات');
      return false;
    }
    return true;
  }

}

