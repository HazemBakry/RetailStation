import { Component, OnInit, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralAccountService } from '../../services/general-account.service';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/components/Shared/services/shared.service';

@Component({
  selector: 'app-new-entry',
  templateUrl: './new-entry.component.html',
  styleUrls: ['./new-entry.component.css']
})
export class NewEntryComponent implements OnInit {
  @ViewChildren('inputs') inputs;
  @ViewChildren('inputs2') inputs2;
  @ViewChildren('inputs3') inputs3;
  AccountsList: any[] = [];
  CostCenterList: any[] = [];
  AccountsListTable: any[] = [];
  EditQuantityList: any[] = [];
  SelectedAccounts: any[] = [];
  Item: any;
  AccountNumber: string;
  activeTab = 'Account'

  constructor(private modalService: NgbModal, private sharedService: SharedService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.GetAccountTreeData();
    this.GetCostCenterTreeData();
  }

  openAccountModal(content: any) {
    this.AccountNumber = '';
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  GetAccountTreeData() {
    this.sharedService.GetAccountTreeData('').subscribe(data => {
      this.AccountsList = data;
    });
  }

  GetCostCenterTreeData() {
    this.sharedService.GetCostCenterTreeData().subscribe(data => {
      this.CostCenterList = data;
    });
  }

  GetSelectedAccount(item: any) {
    this.Item = item;
    let checked = this.SelectedAccounts.find(i => i.accountID == item.accountID);
    if (!checked)
      this.SelectedAccounts.push(item);
    else
      this.toaster.warning('This Account Alredy Selected');
  }

  ClearSelectedAccount(index: number) {
    this.SelectedAccounts.splice(index, 1);
  }

  GetSelectedTemplate(item: any) {

  }

  GetSelectedCostCenter(obj: any, item: any) {
    item.costCenter = obj.nameAR;
  }

  SaveSelectedAccount() {
    if (this.SelectedAccounts.length > 0) {
      this.SelectedAccounts.forEach((account, index) => {
        let checked = this.AccountsListTable.find(i => i.accountID == account.accountID);
        if (!checked)
          this.AccountsListTable.push(account);
      });
      this.modalService.dismissAll();
    }
    else
      this.toaster.warning('Please Select Account');

    if (this.AccountsListTable.length > 0) {
      setTimeout(() => {
        let inputEls = this.inputs.toArray();
        inputEls[0].nativeElement.focus();
      }, 1);
    }
  }

  RemoveAccount(index: number) {
    this.AccountsListTable.splice(index, 1);
  }

  SaveAccount() {
    console.log(this.AccountsListTable);

  }

  FocusDownAndUp(elementId: any, index: number, type: string) {
    let inputEls: any;
    let eventElement = [this.inputs, this.inputs2, this.inputs3];
    let input = eventElement.find(i => i._results[0].nativeElement.id == elementId);
    inputEls = input.toArray();
    if (type == 'down')
      index = Math.min(index + 1, this.AccountsListTable.length - 1);
    else
      index = Math.max(0, index - 1);
    inputEls[index].nativeElement.focus();

  }

  FocusLeftAndRight(elementId: any, index: number) {
    let inputEls: any;
    let eventElement = [this.inputs, this.inputs2, this.inputs3];
    let input = eventElement.find(i => i._results[0].nativeElement.id == elementId);
    inputEls = input.toArray();
    inputEls[index].nativeElement.focus();
  }

  ItemTypeChange(name) {
    if (name == 'Account')
      this.activeTab = 'Account';
    else
      this.activeTab = 'Template';
  }

}
