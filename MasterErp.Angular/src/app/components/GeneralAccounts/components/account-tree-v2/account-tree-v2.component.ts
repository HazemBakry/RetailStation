import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { AccountTreeModel } from '../../models/GeneralAccounts/AccountTree';
import { GeneralAccountService } from '../../services/general-account.service';
import { CreateModifyReturnsModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';

@Component({
  selector: 'app-account-tree-v2',
  templateUrl: './account-tree-v2.component.html',
  styleUrls: ['./account-tree-v2.component.css']
})

export class AccountTreeV2Component implements OnInit {

  @Input() isParentAccount:boolean = false;
  @Output() selectedAccount = new EventEmitter<any>();

  AccountTreeData: any[] = [];
  AccountData: any[] = [];
  showLoader: boolean;
  SearchText = '';
  isSearchMode = false;
  parentAccountsList: any[] = [];
  accountTypes:any[]=[];
  currencyType:any[] = [{ currencyId: 1, nameAR: 'جنيه' }, { currencyId: 1, nameAR: 'ريال' }]

  accountTreeModel: AccountTreeModel =
  {} as AccountTreeModel;
  constructor(private sharedService: SharedService,
              private  GeneralAccountService:GeneralAccountService,private toaster:ToastrService) { }

  ngOnInit(): void {
    this.loadData();
    this.GetAccountTypes();
    this.loadParentAccountsData();
  }

  GetAccountTypes()
  {
    this.sharedService.GetAccountTypes().subscribe(data=>{

      this.accountTypes=data;
    })
  }
  GetCurrencyList() {
    this.GeneralAccountService.GetCurrencyList().subscribe(data => {
      this.currencyType = data;
    });
  }

  loadParentAccountsData()
  {
    this.sharedService.GetAccountsList(true).subscribe(data=>{
      this.parentAccountsList=data;
      
    })
  }
  selectAccount(account)
  {
    if (!this.isParentAccount && account.accountLevel!=5) {
      this.toaster.warning('please select child account');
      return;
    }
    else if (this.isParentAccount && account.accountLevel==5) {
      this.toaster.warning('please select parent account');
      return;
    }
    // console.log(" account:", account);
    this.selectedAccount.emit(account);
  }

  loadData() {

      this.showLoader = true;
    this.sharedService.GetAccountTreeData(this.SearchText).subscribe(data => {
      this.showLoader = false;
      this.isSearchMode = true;
      this.AccountTreeData = data;
 
    });
  }




  CreateNewAccount() {
    if (!this.validateFields()) {
      return;
    }
    this.GeneralAccountService
      .CreateNewAccount(this.accountTreeModel)
      .subscribe((data: CreateModifyReturnsModel) => {
        if (data?.status) {
          this.ClearAllFields();
          this.toaster.success(data?.message);
        } else {
          this.toaster.error(data?.message);
        }
        // this.modalService.dismissAll();
        this.loadData();
      });
  }

  
  validateFields(): boolean {
    let model: AccountTreeModel = this.accountTreeModel;

    if (
          !model.accountNumber||
          !model.nameEN||
          !model.accountTypeId
          
    ) {
      this.toaster.warning('يرجي ملئ جميع الخانات');
      return false;
    }
    return true;
  }
  ClearAllFields() {
    this.accountTreeModel = {} as AccountTreeModel;

  }

  GetSelectedAccountType(accountType)
  {

    this.accountTreeModel.accountTypeId=accountType.accountTypeId;
  }
  GetSelectedCurrencyType(currencyType)
  {
    this.accountTreeModel.currencyTypeId=currencyType.currencyTypeId;
  }
  GetSelectedParentAccount(account:AccountTreeModel)
  {
    this.accountTreeModel.parentAccountId=account.accountId;
    this.accountTreeModel.accountLevel=account.accountLevel+1;

  }
  changeSearchType(event)
  {

  }
}

