import { Component, OnInit } from '@angular/core';
import { FilterItem, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { GeneralAccountService } from '../../services/general-account.service';
import { ToastrService } from 'ngx-toastr';
import { AccountsAssistantLedgerModel, AccountsReportSearchFilterModel } from '../../models/GeneralAccounts/AccountsReportSearchFilterModel';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SearchReportModel } from 'src/app/components/Reports/Models/ReportParams';
import { CreateReportsService } from 'src/app/components/Reports/Services/create-reports.service';

@Component({
  selector: 'app-accounts-assistant-ledger',
  templateUrl: './accounts-assistant-ledger.component.html',
  styleUrls: ['./accounts-assistant-ledger.component.css']
})
export class AccountsAssistantLedgerComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'دفتر الأستاذ المساعد'];
  showLoader: boolean = false;
  showExportLoader: boolean = false;
  
  assistantLedgerResponse: AccountsReportSearchFilterModel = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: '',
    hideEmptyAccounts: false,
    accountId: null,
    fromDate: null,
    toDate: null

  };

  constructor(private generalService: GeneralAccountService, private sharedService: SharedService, private toaster: ToastrService,
    private ReportsService: CreateReportsService
  ) { }

  ngOnInit(): void {
  }

  loadData() {
    if (!this.validateSearchModel()) {
      return;
    }

    this.showLoader = true;
    this.generalService.GetAccountsAssistantLedger(this.assistantLedgerResponse).subscribe((data: PagedResponseDTO<AccountsAssistantLedgerModel[]>) => {
      this.assistantLedgerResponse.results = data.results;
      this.assistantLedgerResponse.totalCount = data.totalCount;
      
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
    this.generalService.ExportAccountsAssistantLedger(this.assistantLedgerResponse).subscribe((data: ActionsResponseModel) => {
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
 if (!this.validateSearchModel()) {
      return;
    }

    let reportParams: SearchReportModel = {} as SearchReportModel;
    let filterItems: FilterItem[] = [
      { categoryName: 'fromDate', itemFlag: this.assistantLedgerResponse.fromDate },
      { categoryName: 'toDate', itemFlag: this.assistantLedgerResponse.toDate },
      { categoryName: 'accountId', itemFlag: this.assistantLedgerResponse.accountId.toString() }
    ];
    reportParams.ControllerName = 'GeneralAccountsReport';
    reportParams.ApiName = 'GetAccountsAssistantLedger';
    reportParams.MethodType = 'POST';
    reportParams.companyName = 'Mishwar';
    reportParams.sectionName = 'AccountAssistantLedger';
    reportParams.pageName = 'دفتر الأستاذ المساعد';
    reportParams.isLandScape = false;
    reportParams.filterItems = filterItems;
    this.showLoader = true;
    this.ReportsService.CreateGeneralReport(reportParams, (timeTaken) => {
      this.showLoader = false;
      console.log(`Generate Report Request Time: ${timeTaken} S`);
    });
  }


  searchDataChanged(filter: AccountsReportSearchFilterModel) {

    this.assistantLedgerResponse.fromDate = filter.fromDate;
    this.assistantLedgerResponse.toDate = filter.toDate;
    this.assistantLedgerResponse.accountId = filter.accountId;
    this.assistantLedgerResponse.costCenterId = filter.costCenterId;
  }
  pageChanged(obj: any) {
    this.assistantLedgerResponse.currentPage = obj.page;
    this.loadData();
  }
  validateSearchModel(): boolean {
    if (
      !this.assistantLedgerResponse.fromDate ||
      !this.assistantLedgerResponse.toDate ||
      !this.assistantLedgerResponse.accountId
    ) {
      this.toaster.warning('يرجي ملئ جميع الخانات');
      return false;
    }
    return true;
  }
}

