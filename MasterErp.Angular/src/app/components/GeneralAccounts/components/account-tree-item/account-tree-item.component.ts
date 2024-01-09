import { Component, Input, OnInit } from '@angular/core';
import { AccountTreeModel } from '../../models/GeneralAccounts/AccountTree';

@Component({
  selector: 'app-account-tree-item',
  templateUrl: './account-tree-item.component.html',
  styleUrls: ['./account-tree-item.component.css']
})
export class AccountTreeItemComponent implements OnInit {
  expanded = false;
  @Input() account: AccountTreeModel;

  constructor() { }

  ngOnInit(): void {
    this.expanded=(this.account.isSelected&&this.account.children.some(x=>x.isSelected));
  }

  toggleNode(account: AccountTreeModel) {
    // account.isSelected=!account.isSelected
    this.expanded = !this.expanded;
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
  //   // console.log(" account:", account);
  //   this.selectedAccount.emit(account);
  // }
}
