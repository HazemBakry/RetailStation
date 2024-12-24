import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GeneralAccountService } from 'src/app/components/GeneralAccounts/services/general-account.service';
import { SharedService } from '../../services/shared.service';
import { SearchFilterModel } from '../../models/FilterModel';
import { ErpSelectorWithSearchComponent } from '../selectors/erp-selector-with-search/erp-selector-with-search.component';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-accounts-report-header',
  templateUrl: './accounts-report-header.component.html',
  styleUrls: ['./accounts-report-header.component.css']
})
export class AccountsReportHeaderComponent implements OnInit {
  @Input() IsParentAccount: boolean = false;
  @Input() showCostCenterFilter: boolean = false;
  @Input() showAccountFilter: boolean = false;
  @Output() SearchData = new EventEmitter<SearchFilterModel>();

  SearchModel: SearchFilterModel = {
    currentPage: 1,
    pageSize: 25,
    isExport: false,
    filterItems: []
  };

  AccountsList: any[] = [];
  CostCenterList: any[] = [];


  @ViewChild('Selector') Selector: ErpSelectorWithSearchComponent;
  @ViewChild('Selector1') Selector1: ErpSelectorWithSearchComponent;
  @ViewChild('Selector2') Selector2: ErpSelectorWithSearchComponent;
  @ViewChild('Selector3') Selector3: ErpSelectorWithSearchComponent;
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
    this.SearchData.emit(this.SearchModel);
  }

  loadAccountsTreeData() {
    this.sharedService.GetAccountsSelector(this.IsParentAccount).subscribe(data => {
      this.AccountsList = data;
    })
  }

  getCostCenterTreeData() {
    this.sharedService.GetCostCenterTreeData().subscribe(data => {
      this.CostCenterList = data;
    });
  }

  getSelectedAccount(acc) {
    this.Selector.SelectorName = acc.accountNumber;
    this.Selector1.SelectorName = acc.nameEN;
    this.SearchModel.filterItems = this.SearchModel.filterItems.filter(x => x.categoryName != 'accountId');
    this.SearchModel.filterItems.push({
      categoryName: 'accountId',
      itemKey: acc.accountId?.toString(),
      itemFlag: acc.accountId?.toString()
    });
    this.emitSearchModel();
    this.offcanvasService.dismiss();
  }

  getSelectedCostCenter(item: any) {
    this.Selector2.SelectorName = item.costCenterNumber;
    this.Selector3.SelectorName = item.nameAR;
    this.SearchModel.filterItems = this.SearchModel.filterItems.filter(x => x.categoryName != 'costCenterId');
    this.SearchModel.filterItems.push({
      categoryName: 'costCenterId',
      itemKey: item.costCenterId?.toString(),
      itemFlag: item.costCenterId?.toString()
    });
    this.emitSearchModel();
  }

  openSidePanel(content: any) {
    this.offcanvasService.open(content, { panelClass: 'details-panel', position: 'end' });
  }
}
