import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GeneralAccountService } from '../../services/general-account.service';
import { AccountsGeneralLedgerModel, AccountsReportSearchFilterModel } from '../../models/GeneralAccounts/AccountsReportSearchFilterModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { CreateReportsService } from 'src/app/components/Reports/Services/create-reports.service';
import { Router } from '@angular/router';
import { SearchReportModel } from 'src/app/components/Reports/Models/ReportParams';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';

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
  constructor(private generalService: GeneralAccountService, private sharedService: SharedService, private toaster: ToastrService,
    private ReportsService: CreateReportsService, private router: Router
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
    let reportParams: SearchReportModel = {} as SearchReportModel;
    let filterItems: FilterItem[] = [
      { categoryName: 'fromDate', itemFlag: this.ledgersResponse.fromDate },
      { categoryName: 'toDate', itemFlag: this.ledgersResponse.toDate },
      { categoryName: 'accountId', itemFlag: this.ledgersResponse.accountId.toString() }
    ];
    reportParams.ControllerName = 'GeneralAccountsReport';
    reportParams.ApiName = 'GetAccountsGeneralLedger';
    reportParams.MethodType = 'POST';
    reportParams.companyName = 'CompanyName';
    reportParams.pageName = 'دفتر الاستاذ العام';
    reportParams.filterItems = filterItems;
    this.ReportsService.CreateGeneralReport(reportParams);
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
