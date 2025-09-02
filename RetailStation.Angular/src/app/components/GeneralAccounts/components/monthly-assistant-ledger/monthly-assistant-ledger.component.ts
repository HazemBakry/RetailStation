import { Component, OnInit } from '@angular/core';
import { GeneralAccountService } from '../../services/general-account.service';
import { ToastrService } from 'ngx-toastr';
import { FilterItem, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { AccountsReportSearchFilterModel } from '../../models/GeneralAccounts/AccountsReportSearchFilterModel';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { CreateReportsService } from 'src/app/components/Reports/Services/create-reports.service';
import { SearchReportModel } from 'src/app/components/Reports/Models/ReportParams';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';

@Component({
  selector: 'app-monthly-assistant-ledger',
  templateUrl: './monthly-assistant-ledger.component.html',
  styleUrls: ['./monthly-assistant-ledger.component.css']
})
export class MonthlyAssistantLedgerComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'الأستاذ المساعد الشهرى'];
  showLoader: boolean = false;
  showExportLoader: boolean = false;
  SearchResult: any[] = [];
  TotalCount: any;
  TotalPages: any;

  searchResponse: AccountsReportSearchFilterModel = {
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

  constructor(private generalService: GeneralAccountService,
    private sharedService: SharedService,
    private toaster: ToastrService,
    private ReportsService: CreateReportsService
  ) { }

  ngOnInit(): void {
  }

  loadData() {
    if (!this.validateSearchModel()) {
      return;
    }
    this.showLoader = true;
    this.generalService.GetMonthlyAssistantLedger(this.searchResponse).subscribe((data: PagedResponseDTO<any[]>) => {
      this.searchResponse.results = data.results;
      this.searchResponse.totalCount = data.totalCount;
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
    this.generalService.ExportMonthlyAssistantLedger(this.searchResponse).subscribe((data: ActionsResponseModel) => {
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
      { categoryName: 'fromDate', itemFlag: this.searchResponse.fromDate },
      { categoryName: 'toDate', itemFlag: this.searchResponse.toDate },
      { categoryName: 'accountId', itemFlag: this.searchResponse.accountId.toString() }
    ];
    reportParams.ControllerName = 'GeneralAccountsReport';
    reportParams.ApiName = 'GetMonthlyAssistantLedger';
    reportParams.MethodType = 'POST';
    reportParams.companyName = 'Mishwar';
    reportParams.sectionName = 'MonthlyAssistantLedger';
    reportParams.pageName = 'الأستاذ المساعد الشهرى';
    reportParams.isLandScape = false;
    reportParams.filterItems = filterItems;
    this.showLoader = true;
    this.ReportsService.CreateGeneralReport(reportParams, (timeTaken) => {
      this.showLoader = false;
    });
  }

  searchDataChanged(filter: AccountsReportSearchFilterModel) {
    this.searchResponse.fromDate = filter.fromDate;
    this.searchResponse.toDate = filter.toDate;
    this.searchResponse.accountId = filter.accountId;
    this.searchResponse.costCenterId = filter.costCenterId;
  }

  pageChanged(obj: any) {
    this.searchResponse.currentPage = obj.page;
    this.loadData();
  }

  validateSearchModel(): boolean {
    if (
      !this.searchResponse.fromDate ||
      !this.searchResponse.toDate
    ) {
      this.toaster.warning('يرجي ملئ جميع الخانات');
      return false;
    }
    return true;
  }
}

