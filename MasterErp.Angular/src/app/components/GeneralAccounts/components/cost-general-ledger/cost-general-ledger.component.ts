import { Component, OnInit } from '@angular/core';
import { SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { GeneralAccountService } from '../../services/general-account.service';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { AccountsGeneralLedgerModel, AccountsReportSearchFilterModel, CostGeneralLedgerModel } from '../../models/GeneralAccounts/AccountsReportSearchFilterModel';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { SharedService } from 'src/app/components/Shared/services/shared.service';

@Component({
  selector: 'app-cost-general-ledger',
  templateUrl: './cost-general-ledger.component.html',
  styleUrls: ['./cost-general-ledger.component.css']
})

export class CostGeneralLedgerComponent implements OnInit {
  TitleList = ['الحسابات العامة', 'دفتر الأستاذ العام - مراكز التكلفة'];


  
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
    this.generalService.GetCostGeneralLedger(this.ledgersResponse).subscribe((data: PagedResponseDTO<CostGeneralLedgerModel[]>) => {
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

  exportData() {
    if (!this.validateSearchModel()) {
      return;
    }
    this.showExportLoader = true;
    this.generalService.ExportCostGeneralLedger(this.ledgersResponse).subscribe((data: ActionsResponseModel) => {
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
    
    if (
      !this.ledgersResponse.fromDate ||
      !this.ledgersResponse.toDate ||
      !this.ledgersResponse.costCenterId
    ) {
      this.toaster.warning('يرجي ملئ جميع الخانات');
      return false;
    }
    return true;
  }


  

}