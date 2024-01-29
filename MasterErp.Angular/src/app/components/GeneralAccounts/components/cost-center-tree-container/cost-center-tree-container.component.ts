import { Component, OnInit } from '@angular/core';
import { CostCenterTreeModel } from '../../models/GeneralAccounts/CostCenter';
import { GeneralAccountService } from '../../services/general-account.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { ExcelExportStyle } from 'src/app/components/Shared/Enums/ImporterTemplateEnum';
import { CreateModifyReturnsModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';

@Component({
  selector: 'app-cost-center-tree-container',
  templateUrl: './cost-center-tree-container.component.html',
  styleUrls: ['./cost-center-tree-container.component.css']
})
export class CostCenterTreeContainerComponent implements OnInit {
  selectedCostCenterTreeModel: CostCenterTreeModel = {} as CostCenterTreeModel;
  isUpdate:boolean=false;
  reloadData:boolean=false;
  constructor(private _GeneralAccountService:GeneralAccountService,private _SharedService:SharedService,private toaster:ToastrService) { }


  ngOnInit(): void {
  }

  dataUpdated(event)
  {

    this.isUpdate=false;
    this.selectedCostCenterTreeModel={} as CostCenterTreeModel;
    this.reloadData=!this.reloadData;
  }
  selectedCostCenter(costCenter:CostCenterTreeModel)
  {
    this.selectedCostCenterTreeModel=costCenter;
    this.isUpdate=true;
  }
  exportData()
  {
    this._GeneralAccountService.ExportCostCenterTreeList("").subscribe(
      (data: any) => {

        if (data) {
          this._SharedService.urlDownloadOrOpen(data.url);
          this.toaster.success("Exported Successfully");
        } else {
          this.toaster.error('Failed To Export');
        }
    });

  }
  downloadImporterTemplate()
  {
    this._SharedService.downloadImporterTemplate(ExcelExportStyle.costCenterTree).subscribe((data:CreateModifyReturnsModel)=>{
      this._SharedService.urlDownloadOrOpen(data.url);
    })
  }
  selectedFile: File | null = null;
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']; // Allowed file types
  
    if (file && allowedTypes.includes(file.type)) {
      this.selectedFile = file;
      this.onUpload();
    } else {
      this.toaster.error('Invalid file format. Only Excel files (.xlsx) are allowed.');
    }
  }

  onUpload(): void {
    if (this.selectedFile) {
  
      const formData = new FormData();
      formData.append('File', this.selectedFile);
  
      this._GeneralAccountService.ImportCostCenterTreeList(formData).subscribe(
        (data: any) => {
          console.log("🚀onUpload ~ data:", data)
          if (data) {
            this._SharedService.urlDownloadOrOpen(data.url);
            this.toaster.success("Uploaded Successfully");
          } else {
            this.toaster.error('Failed To Upload');
          }

      });

 
    } else {
      console.error('No file selected');
    }
  }
}
