import { Component, OnInit } from '@angular/core';
import { AccountTreeModel } from '../../models/GeneralAccounts/AccountTree';

@Component({
  selector: 'app-account-tree-container',
  templateUrl: './account-tree-container.component.html',
  styleUrls: ['./account-tree-container.component.css']
})
export class AccountTreeContainerComponent implements OnInit {
  selectedAccountTreeModel: AccountTreeModel = {} as AccountTreeModel;
  isUpdate:boolean=false;
  reloadData:boolean=false;
  constructor() { }

  ngOnInit(): void {
  }

  dataUpdated(event)
  {

    this.isUpdate=false;
    this.selectedAccountTreeModel={} as AccountTreeModel;
    this.reloadData=!this.reloadData;
  }
  selectedAccount(account:AccountTreeModel)
  {
    this.selectedAccountTreeModel=account;
    this.isUpdate=true;
  }
}
