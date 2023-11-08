import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GeneralAccountService } from 'src/app/components/GeneralAccounts/services/general-account.service';
import { SharedService } from '../../services/shared.service';
import { SearchFilterModel } from '../../models/FilterModel';
import { ErpSelectorWithSearchComponent } from '../selectors/erp-selector-with-search/erp-selector-with-search.component';

@Component({
  selector: 'app-accounts-report-header',
  templateUrl: './accounts-report-header.component.html',
  styleUrls: ['./accounts-report-header.component.css']
})
export class AccountsReportHeaderComponent implements OnInit  {
  @Input() IsParentAccount:boolean = false;
  @Output() SearchData = new EventEmitter<SearchFilterModel>();


  @Input() Transferring = false;
  @Input() ShowAllBranch = false;
  @Input() ShowSearchInput = false;
  @Output() SearchAction = new EventEmitter<any>();
  @Output() ExportAction = new EventEmitter<any>();
  @Output() PrintAction = new EventEmitter<any>();

  SearchModel: SearchFilterModel = {
    currentPage: 1,
    pageSize: 25,
    isExport: false,
    filterItems: []
  };
  FromDate: any;
  ToDate: any;
  branchId: any;
  UserModel: any;
  BranchName: string;
  isAdminBranch = false;
  AccountsList: any[] = [];
  SearchText = '';
  Lang = 'en';
  TransferType = 'Transfer Types';

  //SwitcherType = 'Summary';
  @ViewChild('Selector') Selector: ErpSelectorWithSearchComponent;
  @ViewChild('Selector1') Selector1: ErpSelectorWithSearchComponent;
  constructor(private sharedService:SharedService,private datepipe: DatePipe,private generalService: GeneralAccountService ) { }

  ngOnInit(): void {
    this.Lang = localStorage.getItem('lang');
    this.UserModel = JSON.parse(localStorage.getItem('UserModel'));
    this.isAdminBranch = this.UserModel?.isAdminBranch;
    this.BranchName = this.Lang == 'en' ? 'Branches' : 'الفروع';
    let endDate = new Date();
    // this.ToDate = this.datepipe.transform(endDate, 'yyyy-MM-dd');
    // this.FromDate = this.datepipe.transform(endDate, 'yyyy-MM-dd');
    this.getBranches();
    this.loadAccountsTreeData();
  }

  emitSearchModel() {
    this.SearchData.emit(this.SearchModel);
  }
  loadAccountsTreeData()
  {
    this.sharedService.GetAccountsList(this.IsParentAccount).subscribe(data=>{
      this.AccountsList=data;
      
    })
  }
  getBranches() {
    // this.generalService.GetChildAccountsList().subscribe(data => {
    //   this.Branches = data;
    //   if (!this.isAdminBranch) {
    //     let branch = this.Branches.find(i => i.branchId == this.UserModel?.branchId);
    //     if (branch) {
    //       this.BranchName = branch.nameEn;
    //       this.branchId = branch.branchId;
    //     }
    //   }

    // });
  }

  GetSelectedAccount(acc)
  {
    this.Selector.SelectorName=acc.accountNumber;
    this.Selector1.SelectorName=acc.nameAR;
    
    this.SearchModel.filterItems=[];
    this.SearchModel.filterItems.push({
      categoryName:'accountId',
      itemKey:acc.accountID?.toString(),
      itemFlag:acc.accountID?.toString()
    });
    this.emitSearchModel();
  }

  onBranchChange(branch: any) {
    this.branchId = branch.branchId;
    this.BranchName = this.Lang == 'en' ? branch.nameEn : branch.nameAr;
  }

  ReportSearchClick() {
    let obj = {
      FromDate: this.datepipe.transform(this.FromDate, 'yyyy-MM-dd'),
      ToDate: this.datepipe.transform(this.ToDate, 'yyyy-MM-dd'),
      BranchId: this.branchId,
      TransferType: this.TransferType,
      SearchText: this.SearchText,
      BranchName : this.BranchName
    }
    this.SearchAction.emit(obj);
  }

  ReportExportClick() {
    let obj = {
      FromDate: this.datepipe.transform(this.FromDate, 'yyyy-MM-dd'),
      ToDate: this.datepipe.transform(this.ToDate, 'yyyy-MM-dd'),
      BranchId: this.branchId,
      TransferType: this.TransferType,
      SearchText: this.SearchText,
    }
    this.ExportAction.emit(obj);
  }

  PrintClick() {
    let obj = {
      FromDate: this.datepipe.transform(this.FromDate, 'yyyy-MM-dd'),
      ToDate: this.datepipe.transform(this.ToDate, 'yyyy-MM-dd'),
      BranchId: this.branchId,
      TransferType: this.TransferType,
      SearchText: this.SearchText,
      BranchName : this.BranchName
    }
    this.PrintAction.emit(obj);
  }

}