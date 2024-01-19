import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AccountTreeModel } from '../../models/GeneralAccounts/AccountTree';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { GeneralAccountService } from '../../services/general-account.service';
import { CreateModifyReturnsModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';
import { ErpSelectorWithSearchComponent } from 'src/app/components/Shared/components/selectors/erp-selector-with-search/erp-selector-with-search.component';

@Component({
  selector: 'app-add-edit-account-tree',
  templateUrl: './add-edit-account-tree.component.html',
  styleUrls: ['./add-edit-account-tree.component.css']
})
export class AddEditAccountTreeComponent implements OnInit,OnChanges {
  @Input() isUpdate: boolean = false;
  @Input() accountTreeModel: AccountTreeModel = {} as AccountTreeModel;

  @Output() dataUpdated = new EventEmitter<boolean>();

  @ViewChild('Selector') Selector: ErpSelectorWithSearchComponent;
  @ViewChild('Selector1') Selector1: ErpSelectorWithSearchComponent;
  @ViewChild('Selector2') Selector2: ErpSelectorWithSearchComponent;
  showLoader: boolean;
  parentAccountsList: any[] = [];
  accountTypes: any[] = [];
  currencyType: any[] = [{ currencyId: 1, nameAR: 'جنيه' }, { currencyId: 1, nameAR: 'ريال' }]

  constructor(private sharedService: SharedService,
    private _GeneralAccountService: GeneralAccountService, private toaster: ToastrService) { }


  ngOnInit(): void {
    
    this.GetAccountTypes();
    this.loadParentAccountsData();
   
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes&&!changes['accountTreeModel'].firstChange) {
      if (this.accountTreeModel&&this.accountTreeModel!=null) {
        this.Selector.SelectorName=this.accountTypes.find(x=>x.accountTypeId==this.accountTreeModel.accountTypeId)?.nameAR;
        this.Selector1.SelectorName=this.parentAccountsList.find(x=>x.accountId==this.accountTreeModel.parentAccountId)?.nameAR;
      }
    }
  }

  GetAccountTypes() {
    this.sharedService.GetAccountTypes().subscribe(data => {

      this.accountTypes = data;
    })
  }
  GetCurrencyList() {
    this._GeneralAccountService.GetCurrencyList().subscribe(data => {
      this.currencyType = data;
    });
  }

  loadParentAccountsData() {
    this.sharedService.GetAccountsList(true).subscribe(data => {
      this.parentAccountsList = data;

    })
  }

  CreateNewAccount() {
    if (!this.validateFields()) {
      return;
    }
    this._GeneralAccountService
      .CreateNewAccount(this.accountTreeModel)
      .subscribe((data: CreateModifyReturnsModel) => {
        if (data?.status) {
          this.ClearAllFields();
          this.toaster.success(data?.message);
        } else {
          this.toaster.error(data?.message);
        }
        // this.modalService.dismissAll();
        this.dataUpdated.emit(true);
      });
  }
  UpdateAccountTree(){
    if (!this.validateFields()||!this.accountTreeModel.accountId) {
      return;
    }
    this._GeneralAccountService
      .UpdateAccountTree(this.accountTreeModel.accountId,this.accountTreeModel)
      .subscribe((data: CreateModifyReturnsModel) => {
        if (data?.status) {
          this.ClearAllFields();
          this.toaster.success(data?.message);
        } else {
          this.toaster.error(data?.message);
        }
        // this.modalService.dismissAll();
        this.dataUpdated.emit(true);
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
    this.isUpdate=false;
    this.accountTreeModel = {} as AccountTreeModel;
    this.Selector.SelectorName='نوع الحساب';
    this.Selector1.SelectorName='اسم الحساب';
    this.Selector2.SelectorName='نوع العملة';
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
}
