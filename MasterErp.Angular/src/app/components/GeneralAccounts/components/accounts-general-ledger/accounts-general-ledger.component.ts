import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GeneralAccountService } from '../../services/general-account.service';
import { AccountsGeneralLedgerModel, AccountsReportSearchFilterModel } from '../../models/GeneralAccounts/AccountsReportSearchFilterModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { CreateReportsService } from 'src/app/components/Reports/Services/create-reports.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchReportModel } from 'src/app/components/Reports/Models/ReportParams';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';

@Component({
  selector: 'app-accounts-general-ledger',
  templateUrl: './accounts-general-ledger.component.html',
  styleUrls: ['./accounts-general-ledger.component.css']
})
export class AccountsGeneralLedgerComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'الأستاذ العام'];
  showLoader: boolean = false;
  showExportLoader: boolean = false;
  firstLoad: boolean = true;
  totalDebit = null;
  totalCredit = null;
  ledgersResponse: AccountsReportSearchFilterModel = {
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
    private ReportsService: CreateReportsService, private acRoute: ActivatedRoute,

  ) { }

  ngOnInit(): void {
  }

  loadData() {
    if (!this.validateSearchModel()) {
      return;
    }
    //this.SearchFilterModel.isExport = false;
    this.showLoader = true;
    this.totalDebit = null;
    this.totalCredit = null;
    this.generalService.GetAccountsGeneralLedger(this.ledgersResponse).subscribe((data: PagedResponseDTO<AccountsGeneralLedgerModel[]>) => {
      this.ledgersResponse.results = data.results;
      this.ledgersResponse.totalCount = data.totalCount;
      var baseAccount = this.ledgersResponse.results?.find(x => x.accountId == this.ledgersResponse.accountId);

      if (baseAccount) {
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
    if (!this.validateSearchModel()) {
      return;
    }

    let reportParams: SearchReportModel = {} as SearchReportModel;
    let filterItems: FilterItem[] = [
      { categoryName: 'fromDate', itemFlag: this.ledgersResponse.fromDate },
      { categoryName: 'toDate', itemFlag: this.ledgersResponse.toDate },
      { categoryName: 'accountId', itemFlag: this.ledgersResponse.accountId.toString() }
    ];
    reportParams.ControllerName = 'GeneralAccountsReport';
    reportParams.ApiName = 'GetAccountsGeneralLedger';
    reportParams.MethodType = 'POST';
    reportParams.companyName = 'Mishwar';
    reportParams.sectionName = 'AccountGeneralLeadger';
    reportParams.pageName = 'دفتر الاستاذ العام';
    reportParams.isLandScape = false;
    reportParams.filterItems = filterItems;
    this.showLoader = true;
    this.ReportsService.CreateGeneralReport(reportParams, (timeTaken) => {
      debugger;
      this.showLoader = false;
      console.log(`Generate Report Request Time: ${timeTaken} S`);
    });
  }


  searchDataChanged(filter: AccountsReportSearchFilterModel) {

    this.ledgersResponse.fromDate = filter.fromDate;
    this.ledgersResponse.toDate = filter.toDate;
    this.ledgersResponse.accountId = filter.accountId;
    this.ledgersResponse.costCenterId = filter.costCenterId;

    // when redirect to ledger from account directive 
    if (this.ledgersResponse.fromDate &&
      this.ledgersResponse.toDate &&
      this.ledgersResponse.accountId) {
      this.acRoute.queryParams.subscribe((params: any) => {
        if (params.AccountId) {
          this.loadData();
          this.firstLoad = false;
        }
      });
    }
  }
  pageChanged(obj: any) {
    this.ledgersResponse.currentPage = obj.page;
    this.loadData();
  }
  validateSearchModel(): boolean {
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
}
