import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { AccountTreeModel } from '../../models/GeneralAccounts/AccountTree';
import { GeneralAccountService } from '../../services/general-account.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { AccountOpeningBalanceModel } from '../../models/GeneralAccounts/OpeningBalance';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';

@Component({
  selector: 'app-opening-balance',
  templateUrl: './opening-balance.component.html',
  styleUrls: ['./opening-balance.component.css']
})
export class OpeningBalanceComponent implements OnInit {

  @Input() isParentAccount: boolean = false;
  @Output() selectedAccount = new EventEmitter<any>();

  showAllAccounts: boolean = false;
  AccountTreeData: any[] = [];
  AccountData: any[] = [];
  showLoader: boolean;
  SearchText = '';
  isSearchMode = false;
  parentAccountsList: any[] = [];
  accountTypes: any[] = [];
  currencyType: any[] = [{ currencyId: 1, nameAR: 'جنيه' }, { currencyId: 1, nameAR: 'ريال' }]

  accountTreeModel: AccountTreeModel =
    {} as AccountTreeModel;

  accountsOpeningBalance: AccountTreeModel[] = [];
  constructor(private sharedService: SharedService,
    private GeneralAccountService: GeneralAccountService,
    private lookupService: LookupService,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    // this.loadData();
    // this.GetAccountTypes();
    // this.loadParentAccountsData();
  }

  GetAccountTypes() {
    this.lookupService.GetAccountTypes().subscribe(data => {

      this.accountTypes = data;
    })
  }
  GetCurrencyList() {
    this.GeneralAccountService.GetCurrencyList().subscribe(data => {
      this.currencyType = data;
    });
  }

  loadParentAccountsData() {
    this.sharedService.GetAccountsSelector(true).subscribe(data => {
      this.parentAccountsList = data;

    })
  }
  selectAccount(account) {
    if (!this.isParentAccount && account.accountLevel != 5) {
      this.toaster.warning('please select child account');
      return;
    }
    else if (this.isParentAccount && account.accountLevel == 5) {
      this.toaster.warning('please select parent account');
      return;
    }
    // console.log(" account:", account);
    this.selectedAccount.emit(account);
  }

  loadData(SearchText = '') {

    this.showLoader = true;
    this.GeneralAccountService.GetAccountsOpeningBalanceData(SearchText).subscribe((data: AccountTreeModel[]) => {
      this.showLoader = false;
      this.accountsOpeningBalance = this.SearchText ? data.filter(x => x.isSelected) : data;

    }, (error) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  NumbersOnly(key: any): boolean {
    // let patt = /^\d+(\.\d+)?$/;
    let patt = /^[1-9]\d*(\.\d+)?$/
    let result = patt.test(key);
    return result;
  }
  updateAccountsOpeningBalance() {
    this.showLoader = true;

    const updateLst = this.accountsOpeningBalance.filter(x => x.preCredit > 0 || x.preDebit);
    this.GeneralAccountService
      .UpdateAccountsOpeningBalance(updateLst).subscribe((data: ActionsResponseModel) => {
        if (data?.status) {
          this.ClearAllFields();
          this.toaster.success(data?.message);
        } else {
          this.toaster.error(data?.message);
        }
        this.loadData();

      }, (error) => {
        this.showLoader = false;
      }, () => {
        this.showLoader = false;
      });
  }


  CreateNewAccount() {
    if (!this.validateFields()) {
      return;
    }
    this.GeneralAccountService
      .AddNewAccount(this.accountTreeModel)
      .subscribe((data: ActionsResponseModel) => {
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
      !model.accountNumber ||
      !model.nameEN ||
      !model.accountTypeId

    ) {
      this.toaster.warning('يرجي ملئ جميع الخانات');
      return false;
    }
    return true;
  }
  ClearAllFields() {
    this.accountsOpeningBalance = [];
    this.SearchText = '';
    // this.accountTreeModel = {} as AccountTreeModel;

  }

  GetSelectedAccountType(accountType) {

    this.accountTreeModel.accountTypeId = accountType.accountTypeId;
  }
  GetSelectedCurrencyType(currencyType) {
    this.accountTreeModel.currencyTypeId = currencyType.currencyTypeId;
  }
  GetSelectedParentAccount(account: AccountTreeModel) {
    this.accountTreeModel.parentAccountId = account.accountId;
    this.accountTreeModel.accountLevel = account.accountLevel + 1;

  }
  changeSearchType(event) {

  }
}

