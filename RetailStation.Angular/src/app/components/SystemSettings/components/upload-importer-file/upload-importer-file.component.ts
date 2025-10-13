import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';

import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { FileImportModel, ImporterColumnModel } from '../../models/DataImporter';
import { DataImportersService } from '../../services/data-importers.service';
import { CustomValidators } from 'src/app/components/Shared/services/custom-validators';

@Component({
  selector: 'app-upload-importer-file',
  templateUrl: './upload-importer-file.component.html',
  styleUrls: ['./upload-importer-file.component.css']
})
export class UploadImporterFileComponent implements OnInit {
  // @Input() importerId: number;
  @Input() importerName: string;
  @Input() fromSinglePage: boolean = true;
  @Input() useTemplateSP: boolean = false;
  @Input() useExternalService: boolean = false;
  @Input() btnDesign: string = 'default';
  @Output() dataUpdated = new EventEmitter<boolean>();
  @Output() uploadedFile = new EventEmitter<File>();
  showExportLoader: boolean = false;

  fileImportModel: FileImportModel = {} as FileImportModel;
  // dataSelectorData: FormDropdownModel[] = [];
  selectedFile: File;
  attachmentFiles: File[] = [];
  formData: FormData = new FormData();
  selectedTemplateId: number;

  columns: ImporterColumnModel[] = [];
  showAddLoader: boolean = false;
  public formGroup: FormGroup;
  public formErrors = {
    importerId: '',
    importFile: '',

  };

  constructor(private modalService: NgbModal, private dataImportersService: DataImportersService, private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {

  }



  openImportFileSidePanel(content: any) {
    this.initNewForm();
    this.columns = [];
    this.loadSelectors();

    // this.buildForm();
    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });
  }


  downloadFile(url: string) {
    this.sharedService.urlDownloadOrOpen(url);
  }
  initNewForm(fileImportModel: FileImportModel = null) {
    this.formData = new FormData();
    this.attachmentFiles = [];
    this.selectedFile = null;
    this.buildForm();

  }
  buildForm() {
    this.formGroup = this.form.group({
      importerId: [null],
      importFile: [null as File, [Validators.required, CustomValidators.extensionValidator(['.xls', 'xlsx', '.csv'])]]

    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
  }

  saveImportFile() {
    if (!this.validateForm()) {
      return;
    }
    this.fileImportModel = this.formGroup.value;

    if (this.importerName && this.selectedFile != null)
      if (!this.useExternalService) {

        this.executeImporter();
      }
      else {
        this.uploadedFile.emit(this.selectedFile);
        this.modalService?.dismissAll();
      }
    else
      this.toaster.warning('please add file', 'Warning');
  }




  executeImporter() {

    this.formData = new FormData();
    if (this.selectedFile != null) {
      this.formData.append('importFile', this.selectedFile);
    }
    else
      return
    // if (this.attachmentFiles.length > 0) {
    //   for (const file of this.attachmentFiles) {
    //     this.formData.append('importFile', file);
    //   }
    // }
    // else
    //   return;

    // Object.keys(this.formGroup.value).forEach(key => {
    //   if (key != 'importFile'&& this.formGroup.value[key])
    //     this.formData.append(key, this.formGroup.value[key]);
    // });

    this.showAddLoader = true;
    this.dataImportersService.ExecuteImporterByName(this.importerName, this.formData).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.initNewForm();
        this.toaster.success(data?.message);
        this.dataUpdated.emit(true);
        this.modalService?.dismissAll();
      }
      else {
        this.toaster.error(data?.message);
      }

      this.sharedService.urlDownloadOrOpen(data.url);

      this.showAddLoader = false;
    }, err => {
      this.showAddLoader = false;
    }, () => {
      this.showAddLoader = false;
    });

  }
  loadSelectors() {

  }

  validateForm(): boolean {
    this._FormService.markFormGroupTouched(this.formGroup);
    if (this.formGroup.valid) {
      return true;
    } else {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, false)
      return false;
    }
  }



  updateFieldsRequiredValidation() {
    this.formGroup.get('uploadType').valueChanges.subscribe(data => {

      const type = this.formGroup.get('type');

      if (data == 'status') {
        type.clearValidators();
        type.setValidators([Validators.required]);

      } else {
        type.clearValidators();
      }

      type.updateValueAndValidity();

    });
  }


  removeSelectedFile(sFile: File) {
    this.attachmentFiles = Array.from(this.attachmentFiles)?.filter(file => file.name !== sFile.name);

    if (this.attachmentFiles?.length == 0)
      this.formGroup?.patchValue({ attachmentFiles: null });
  }

  onFileChange(event: any) {
    // this.attachmentFiles = event.target.files;
    this.selectedFile = event.target.files[0];
    //this.documentsFileName = event.target.files[0].name;
  }

  exportTemplateByName() {
    if (this.useTemplateSP) {
      this.showExportLoader = true;
      this.dataImportersService.ExportTemplateByImporterLookup(this.importerName).subscribe((data: ActionsResponseModel) => {
        if (data.isSuccess) {
          this.sharedService.urlDownloadOrOpen(data.url);
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
    else {
      this.showExportLoader = true;
      this.dataImportersService.ExportTemplateByImporterName(this.importerName).subscribe((data: ActionsResponseModel) => {
        if (data.isSuccess) {
          this.sharedService.urlDownloadOrOpen(data.url);
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



}



