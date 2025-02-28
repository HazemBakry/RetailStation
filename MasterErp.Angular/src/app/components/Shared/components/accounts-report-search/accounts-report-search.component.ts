import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GeneralAccountService } from 'src/app/components/GeneralAccounts/services/general-account.service';
import { SharedService } from '../../services/shared.service';
import { SearchFilterModel } from '../../models/FilterModel';
import { ErpSelectorWithSearchComponent } from '../selectors/erp-selector-with-search/erp-selector-with-search.component';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { AccountsReportSearchFilterModel } from 'src/app/components/GeneralAccounts/models/GeneralAccounts/AccountsReportSearchFilterModel';
import { FormDropdownModel } from '../drop-down-form-control/drop-down-form-control.component';

@Component({
  selector: 'app-accounts-report-search',
  templateUrl: './accounts-report-search.component.html',
  styleUrls: ['./accounts-report-search.component.css']
})
export class AccountsReportSearchComponent implements OnInit {
  @Input() isParentAccount: boolean = false;
  @Input() showCostCenterFilter: boolean = false;
  @Input() showAccountFilter: boolean = false;
  @Output() searchDataChanged = new EventEmitter<AccountsReportSearchFilterModel>();



  searchModel: AccountsReportSearchFilterModel = {
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

  accountsSelectorData: FormDropdownModel[] = [];
  costCenterSelectorData: FormDropdownModel[] = [];
  // @ViewChild('Selector') Selector: ErpSelectorWithSearchComponent;
  // @ViewChild('Selector1') Selector1: ErpSelectorWithSearchComponent;
  // @ViewChild('Selector2') Selector2: ErpSelectorWithSearchComponent;
  // @ViewChild('Selector3') Selector3: ErpSelectorWithSearchComponent;
  constructor(private sharedService: SharedService,
    private datePipe: DatePipe,
    private generalService: GeneralAccountService,
    private offcanvasService: NgbOffcanvas
  ) { }

  ngOnInit(): void {

    // this.ToDate = this.datePipe.transform(endDate, 'yyyy-MM-dd');
    // this.FromDate = this.datePipe.transform(endDate, 'yyyy-MM-dd');

    this.loadAccountsTreeData();
    this.getCostCenterTreeData();
  }

  emitSearchModel() {
    this.searchDataChanged.emit(this.searchModel);
  }

  loadAccountsTreeData() {
    this.sharedService.GetAccountsSelector(this.isParentAccount).subscribe(data => {
      this.accountsSelectorData = data;
    })
  }

  getCostCenterTreeData() {
    this.sharedService.GetCostCenterSelector().subscribe(data => {
      this.costCenterSelectorData = data;
    });
  }

  getSelectedAccount(accountId) {
    this.searchModel.accountId = accountId;

    // this.searchModel.filterList = this.searchModel.filterList .filter(x => x.categoryName != 'accountId');
    // this.searchModel.filterList .push({
    //   categoryName: 'accountId',
    //   itemKey: accountId?.toString(),
    //   itemFlag: accountId?.toString()
    // });
    this.emitSearchModel();
    // this.offcanvasService.dismiss();
  }

  getSelectedCostCenter(costCenterId: any) {
    this.searchModel.costCenterId = costCenterId;
    this.emitSearchModel();
  }

  openSidePanel(content: any) {
    this.offcanvasService.open(content, { panelClass: 'details-panel', position: 'end' });
  }
}
