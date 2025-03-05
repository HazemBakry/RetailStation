import { Component, OnInit } from '@angular/core';
import { AccountTreeModel } from '../../models/GeneralAccounts/AccountTree';
import { GeneralAccountService } from '../../services/general-account.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ExcelExportStyle } from 'src/app/components/Shared/Enums/ImporterTemplateEnum';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account-tree-container',
  templateUrl: './account-tree-container.component.html',
  styleUrls: ['./account-tree-container.component.css']
})
export class AccountTreeContainerComponent implements OnInit {
  selectedAccountTreeModel: AccountTreeModel = {} as AccountTreeModel;
  isUpdate: boolean = false;
  reloadData: boolean = false;
  showExportLoader: boolean = false;
  TitleList = ['الحسابات العامة', 'شجرة الحسابات'];

  constructor(private _GeneralAccountService: GeneralAccountService, private _SharedService: SharedService, private toaster: ToastrService) { }

  ngOnInit(): void {
  }

  dataUpdated(event) {

    this.isUpdate = false;
    console.log("🚀 ~ AccountTreeContainerComponent ~ dataUpdated ~ this.isUpdate:", this.isUpdate)
    this.selectedAccountTreeModel = null;
    console.log("🚀 ~ AccountTreeContainerComponent ~ dataUpdated ~ this.selectedAccountTreeModel:", this.selectedAccountTreeModel)
    this.reloadData = !this.reloadData;
  }

  selectedAccount(account: AccountTreeModel) {
    this.selectedAccountTreeModel = account;
    this.isUpdate = true;
  }


  exportData() {
    this.showExportLoader = true;
    this._GeneralAccountService.ExportAccountTreeList("").subscribe((data: ActionsResponseModel) => {
      if (data.isSuccess) {
        this._SharedService.urlDownloadOrOpen(data.url);
        this.toaster.success(data.message);
      } else {
        this.toaster.error(data.message);
      }


      this.showExportLoader = false;
    }, err => {
      this.showExportLoader = false;
    }, () => {
      this.showExportLoader = false;
    });


  }
}
