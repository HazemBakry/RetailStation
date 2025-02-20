import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { SupplierModel } from 'src/app/components/Purchases/models/SupplierModel';
import { DataImportersService } from '../../services/data-importers.service';
import { ImporterModel } from '../../models/DataImporter';

@Component({
  selector: 'app-data-importers',
  templateUrl: './data-importers.component.html',
  styleUrls: ['./data-importers.component.css']
})
export class DataImportersComponent implements OnInit {
  TitleList = ['استيراد البيانات', 'الاعدادات'];

  importerTemplateModel: ImporterModel = {} as ImporterModel;
  importerResponseModel: PagedResponseDTO<ImporterModel[]> = {
    results: [],
    filterList: [],
    pageSize: 20,
    currentPage: 1,
    searchText: ''
  };
  showLoader: boolean = false;
  showExportLoader: boolean = false;
  showAddLoader: boolean = false;
  selectedImporterId: number;
  constructor(private modalService: NgbModal, private dataImportersService: DataImportersService, private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {

    this.loadData();
  }
  loadData() {
    this.showLoader = true;
    this.dataImportersService.GetImporters(this.importerResponseModel).subscribe(data => {
      this.importerResponseModel.results = data.results;
      this.importerResponseModel.totalCount = data.totalCount;

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });


  }
  // exportData(categoryId : number=0)
  // {
  //   this.showExportLoader=true;
  //   this.dataImportersService.ExportImporters(this.importerResponseModel,categoryId).subscribe((data:ActionsResponseModel) => {
  //     if (data.isSuccess) {
  //       this.sharedService.urlDownloadOrOpen(data.url);
  //       this.toaster.success(data.message);
  //     } else {
  //       this.toaster.error(data.message);
  //     }


  //     this.showExportLoader=false;
  //   }, err=>{
  //     this.showExportLoader=false;
  //   },()=>{
  //     this.showExportLoader=false;
  //   });


  // }

  exportTemplateById(importerId : number)
  {
    this.showExportLoader=true;
    this.dataImportersService.ExportTemplateByImporterId(importerId).subscribe((data:ActionsResponseModel) => {
      if (data.isSuccess) {
        this.sharedService.urlDownloadOrOpen(data.url);
        this.toaster.success(data.message);
      } else {
        this.toaster.error(data.message);
      }


      this.showExportLoader=false;
    }, err=>{
      this.showExportLoader=false;
    },()=>{
      this.showExportLoader=false;
    });


  }

  openDeleteModal(content: any, importerId: number) {
    this.selectedImporterId = importerId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }



  filterChecked(filterItems: FilterItem[]) {
    this.importerResponseModel.filterList = filterItems;
    this.loadData();
  }

  pageChanged(obj: any) {
    this.importerResponseModel.currentPage = obj.page;
    this.loadData();
  }


  deleteImporter() {
    // this.showAddLoader = true;
    this.dataImportersService.DeleteImporter(this.selectedImporterId).subscribe(data => {

      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.loadData();
        this.toaster.success(data?.message);
      }
      else {
        this.toaster.error(data?.message);
      }
      this.showAddLoader = false;
    }, err => {
      this.showAddLoader = false;
    }, () => {
      this.showAddLoader = false;
    });
  }
  dataUpdated(isUpdated) {

    if (isUpdated) {
      this.loadData();
    }
  }
}


