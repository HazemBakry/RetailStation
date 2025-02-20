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
  constructor(private _GeneralAccountService: GeneralAccountService, private _SharedService: SharedService, private toaster: ToastrService) { }

  ngOnInit(): void {
  }

  dataUpdated(event) {

    this.isUpdate = false;
    this.selectedAccountTreeModel = {} as AccountTreeModel;
    this.reloadData = !this.reloadData;
  }

  selectedAccount(account: AccountTreeModel) {
    this.selectedAccountTreeModel = account;
    this.isUpdate = true;
  }

  exportData() {
    this._GeneralAccountService.ExportAccountTreeList("").subscribe(
      (data: any) => {
        if (data) {
          this._SharedService.urlDownloadOrOpen(data.url);
          this.toaster.success("Exported Successfully");
        } else {
          this.toaster.error('Failed To Export');
        }
      });
  }

  downloadImporterTemplate() {
    this._SharedService.downloadImporterTemplate(ExcelExportStyle.accountTree).subscribe((data: ActionsResponseModel) => {
      console.log("url", data.url);
      this._SharedService.urlDownloadOrOpen(data.url);
    })
  }

  selectedFile: File | null = null;

  onFileSelected(event: any): void {
    // console.log("🚀  onFileSelected ~ event:", event)
    const file: File = event.target.files[0];
    const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']; // Allowed file types
    if (file && allowedTypes.includes(file.type)) {
      this.selectedFile = file;
      this.onUpload();
    } else {
      // Show an error message or perform any other desired action
      console.error('Invalid file format. Only Excel files (.xlsx) are allowed.');
    }
  }

  onUpload(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('File', this.selectedFile);

      this._GeneralAccountService.ImportAccountTreeList(formData).subscribe(
        (data: any) => {
          // console.log("🚀onUpload ~ data:", data)
          // this.filePath = data.url;
          // if (data) {
          //   this.toaster.success("Uploaded Successfully");
          // } else {
          //   this.toaster.error('Failed To Upload');
          // }
        });
    } else {
      console.error('No file selected');
    }
  }
}
