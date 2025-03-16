import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GeneralAccountService } from 'src/app/components/GeneralAccounts/services/general-account.service';
import { SharedService } from '../../services/shared.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { AccountsReportSearchFilterModel } from 'src/app/components/GeneralAccounts/models/GeneralAccounts/AccountsReportSearchFilterModel';
import { GeneralSelectorModel } from '../general-selector/general-selector.component';

@Component({
  selector: 'app-accounts-report-search',
  templateUrl: './accounts-report-search.component.html',
  styleUrls: ['./accounts-report-search.component.css']
})
export class AccountsReportSearchComponent implements OnInit {
  @Input() isParent: boolean = false;
  @Input() showCostCenter: boolean = false;
  @Input() showAccounts: boolean = false;
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

  accountsSelectorData: GeneralSelectorModel[] = [];
  costCenterSelectorData: GeneralSelectorModel[] = [];
  
  constructor(private sharedService: SharedService,
    private datePipe: DatePipe,
    private generalService: GeneralAccountService,
    private offcanvasService: NgbOffcanvas
  ) { }

  ngOnInit(): void {

    // this.ToDate = this.datePipe.transform(endDate, 'yyyy-MM-dd');
    // this.FromDate = this.datePipe.transform(endDate, 'yyyy-MM-dd');
    if (this.showAccounts) {
      this.loadAccountsTreeData();
    } 
    if (this.showCostCenter) {
      this.loadLoadCostCenterTreeData();
    }
  }

  emitSearchModel() {
    this.searchDataChanged.emit(this.searchModel);
  }

  loadAccountsTreeData() {
    this.sharedService.GetAccountsSelector(this.isParent).subscribe(data => {
      this.accountsSelectorData = data;
    })
  }

  loadLoadCostCenterTreeData() {
    this.sharedService.GetCostCenterSelector(this.isParent).subscribe(data => {
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
