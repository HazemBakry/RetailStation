import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GeneralAccountService } from '../../services/general-account.service';
import { AccountsReportSearchFilterModel, CostAssistantLedgerModel } from '../../models/GeneralAccounts/AccountsReportSearchFilterModel';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { SharedService } from 'src/app/components/Shared/services/shared.service';

@Component({
  selector: 'app-cost-assistant-ledger',
  templateUrl: './cost-assistant-ledger.component.html',
  styleUrls: ['./cost-assistant-ledger.component.css']
})

export class CostAssistantLedgerComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'دفتر الأستاذ المساعد - مراكز التكلفة'];
  showLoader: boolean = false;
  showExportLoader: boolean = false;

  assistantLedgerResponse: AccountsReportSearchFilterModel = {
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

  constructor(private generalService: GeneralAccountService, private sharedService: SharedService, private toaster: ToastrService) { }

  ngOnInit(): void {
  }

  loadData() {
    if (!this.validateSearchModel()) {
      return;
    }

    this.showLoader = true;
    this.generalService.GetCostAssistantLedger(this.assistantLedgerResponse).subscribe((data: PagedResponseDTO<CostAssistantLedgerModel[]>) => {
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
    this.generalService.ExportCostAssistantLedger(this.assistantLedgerResponse).subscribe((data: ActionsResponseModel) => {
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