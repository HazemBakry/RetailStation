import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { AccountTreeModel } from '../../../GeneralAccounts/models/GeneralAccounts/AccountTree';
import { GeneralAccountService } from '../../../GeneralAccounts/services/general-account.service';
import { CreateModifyReturnsModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';

@Component({
  selector: 'app-account-tree-v2',
  templateUrl: './account-tree-v2.component.html',
  styleUrls: ['./account-tree-v2.component.css']
})

export class AccountTreeV2Component implements OnInit, OnChanges {

  @Input() isParentAccount: boolean = false;
  @Input() reloadData: boolean = false;
  @Output() selectedAccount = new EventEmitter<any>();

  accountTreeData: any[] = [];
  AccountData: any[] = [];
  showLoader: boolean;
  searchText = '';
  isSearchMode = false;
  parentAccountsList: any[] = [];
  accountTypes: any[] = [];
  currencyType: any[] = [{ currencyId: 1, nameAR: 'جنيه' }, { currencyId: 1, nameAR: 'ريال' }]

  accountTreeModel: AccountTreeModel =
    {} as AccountTreeModel;
  constructor(private sharedService: SharedService,
    private GeneralAccountService: GeneralAccountService, private toaster: ToastrService) { }


  ngOnInit(): void {
    this.loadData();
    // this.GetAccountTypes();
    // this.loadParentAccountsData();
  }
  ngOnChanges(changes): void {
    if (changes && changes.reloadData && !changes.reloadData.firstChange) {
      this.loadData();
    }
  }


  selectAccount(account: AccountTreeModel) {
    // if (!this.isParentAccount && account.children.length >0) {
    //   this.toaster.warning('please select child account');
    //   return;
    // }
    // else if (this.isParentAccount && account.children.length==0 ) {
    //   this.toaster.warning('please select parent account');
    //   return;
    // }
    // console.log(" account:", account);
    this.selectedAccount.emit(account);
  }

  loadData() {

    this.showLoader = true;
    this.sharedService.GetAccountTreeHierarchicalData(this.searchText).subscribe(data => {
      this.showLoader = false;
      this.isSearchMode = true;
      this.accountTreeData = data;

    }, (error) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }



  changeSearchType(event) {

  }
}

