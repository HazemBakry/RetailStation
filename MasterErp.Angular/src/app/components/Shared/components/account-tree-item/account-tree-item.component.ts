import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountTreeModel } from '../../../GeneralAccounts/models/GeneralAccounts/AccountTree';

@Component({
  selector: 'app-account-tree-item',
  templateUrl: './account-tree-item.component.html',
  styleUrls: ['./account-tree-item.component.css'],
})
export class AccountTreeItemComponent implements OnInit {
  expanded = false;
  @Input() account: AccountTreeModel;

  @Output() selectedAccount = new EventEmitter<AccountTreeModel>();
  @Output() dataUpdated = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {
    this.expanded =
      this.account.isSelected &&
      this.account.children.some((x) => x.isSelected);
  }

  toggleNode(account: AccountTreeModel) {
    // account.isSelected=!account.isSelected
    this.expanded = !this.expanded;
  }
  onEvent(
    e: Event,
    account: AccountTreeModel,
    isDelete: boolean = false
  ): void {
    event.preventDefault();
    event.stopPropagation();
    if (isDelete) {
      account.isDeleteAction = true;
    }
    this.selectAccount(account);
  }
  selectAccount(account: AccountTreeModel) {
    this.selectedAccount.emit(account);
  }
  // selectAccount(account :AccountTreeModel)
  // {
  //   if (!this.isParentAccount && account.accountLevel!=5) {
  //     this.toaster.warning('please select child account');
  //     return;
  //   }
  //   else if (this.isParentAccount && account.accountLevel==5) {
  //     this.toaster.warning('please select parent account');
  //     return;
  //   }
  //   this.selectedAccount.emit(account);
  // }

  getLevelClass(level: number) {
    var paddingValue = level;
    if (level > 0) paddingValue = level / 1.1;
    return 'padding-right:' + paddingValue + 'rem !important';
  }
  accountActionUpdated(isUpdate:boolean)
  {
    this.dataUpdated.emit(isUpdate);
  }
}
