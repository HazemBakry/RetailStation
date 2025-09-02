
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';

import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { DataImportersService } from '../../services/data-importers.service';
import { DBStoredProcedureModel, DBTableModel } from '../../models/DBTableModel';
import { ImporterColumnModel, ImporterModel } from '../../models/DataImporter';

@Component({
  selector: 'app-create-importer',
  templateUrl: './create-importer.component.html',
  styleUrls: ['./create-importer.component.css']
})
export class CreateImporterComponent implements OnInit {
  @Input() importerModel: ImporterModel = {} as ImporterModel;
  @Input() isUpdate: boolean = false;
  @Output() dataUpdated = new EventEmitter<boolean>();
  // unitsSelectorData: FormDropdownModel[] = [];


  dbTablesSelectorData: FormDropdownModel[] = [];
  dbStoredProceduresSelectorData: FormDropdownModel[] = [];
  selectedImporterId: number;

  columns: ImporterColumnModel[] = [];
  showAddLoader: boolean = false;
  public formGroup: FormGroup;
  public formErrors = {
    importerId: '',
    importerName: '',
    importerType: '',
    destinationStoredProcedure: '',
    columns: ''
  };
  dbTablesList: DBTableModel[] = [];
  dbStoredProceduresList: DBStoredProcedureModel[] = [];

  constructor(private modalService: NgbModal, private dataImportersService: DataImportersService, private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {

  }

  open(content: any) {
    this.modalService.open(content, { size: 'lg', centered: true, scrollable: true });
  }

  openAddNewImporterSidePanel(content: any) {
    this.currentStep = 1;
    this.columns = [];
    this
    this.loadSelectors();

    this.buildForm();
    if (this.isUpdate)
      this.fillEditForm(this.importerModel);
    else
      this.addField();
    // this.formGroup.patchValue({employeeId:this.selectedCategoryId});

    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });

    // this.offcanvasService.open(content, { panelClass: 'add-new-panel', position: 'end' });
  }
  buildForm() {
    this.formGroup = this.form.group({
      importerId: [null],
      importerName: [null, [Validators.required]],
      importerType: [null, [Validators.required]],
      destinationStoredProcedure: [null, [Validators.required]],
      columns: [[] as ImporterColumnModel[],]//[Validators.required, Validators.minLength(1)]],

    });

    // this.formGroup?.get('destinationStoredProcedure')?.valueChanges.subscribe((destinationStoredProcedure) => {
    //   if(destinationStoredProcedure)
    //   {
    //     var selectedTable = this.dbTablesList.find(x => x.tableName.toLowerCase() == destinationStoredProcedure.toLowerCase());

    //     if (selectedTable && selectedTable.columns?.length) {
    //       this.columns =[];
    //       selectedTable.columns.forEach((x,i) => this.columns.push({ columnName: x.columnName, dataType: x.dataType,isNullable:x.isNullable,isRequired:!x.isNullable, displayOrder: i + 1}));
    //     }
    //   }
    // });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  saveImporter() {
    if (!this.validateForm()) {
      return;
    }
    if (this.columns.filter(x => x.columnName.trim() && x.dataType).length < 2) {
      this.toaster.warning('Please add at least two field');
      return;
    }
    this.formGroup.patchValue({ columns: this.columns });
    this.importerModel = this.formGroup.value;

    if (this.isUpdate)
      this.editImporter();
    else
      this.addNewImporter();
  }

  addNewImporter() {
    this.showAddLoader = true;
    this.dataImportersService.AddNewImporter(this.importerModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.toaster.success(data?.message);
        this.dataUpdated.emit(true);
        this.modalService?.dismissAll();
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

  editImporter() {
    this.showAddLoader = true;
    this.dataImportersService.EditImporter(this.importerModel.importerId, this.importerModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        // this.initNewForm();
        this.dataUpdated.emit(true);
        this.toaster.success(data?.message);
        this.modalService?.dismissAll();

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
  GetDBStoredProcedure() {
    this.dataImportersService.GetDBStoredProcedure('Importers').subscribe((data: DBStoredProcedureModel[]) => {
      this.dbStoredProceduresList = data;
      this.dbStoredProceduresSelectorData = [...data.map(x => ({ value: x.storedProcedureName, name: x.storedProcedureName }))];
    }, err => {

    }, () => {

    });
  }
  getDBTables() {
    this.dataImportersService.GetDBTables().subscribe((data: DBTableModel[]) => {
      this.dbTablesList = data;
      this.dbTablesSelectorData = [...data.map(x => ({ value: x.tableName, name: x.tableName }))];
    }, err => {

    }, () => {

    });
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


  fillEditForm(importerModel: ImporterModel) {
    this.formGroup.patchValue({
      importerId: importerModel.importerId,
      importerName: importerModel.importerName,
      importerType: importerModel.importerType,
      destinationStoredProcedure: importerModel.destinationStoredProcedure,
      columns: importerModel.columns
    });
    this.columns = importerModel.columns?.length ? importerModel.columns : [];
  }


  loadSelectors() {
    // this.getDBTables();
    this.GetDBStoredProcedure();
    // this.sharedService.GetSuppliersSelector().subscribe((data: FormDropdownModel[]) => {
    //   this.suppliersSelectorData = data;
    // });
  }


  deleteFromList(list: any[], index: number) {
    if (list?.length)
      list.splice(index, 1);
  }
  addField() {
    this.columns.push(
      {
        importerColumnId: null,
        importerId: null,
        columnName: '',
        dataType: '',
        isRequired: false,
        displayOrder: this.columns?.length ? this.columns.length + 1 : 1
      }
    );
  }
  currentStep: number = 0;
  nextAction() {
    if (!this.validateForm()) {
      return;
    }
    if (this.currentStep == 2)
      this.saveImporter();
    if (this.currentStep < 2)
      this.currentStep++;



  }
  previousAction() {
    if (this.currentStep > 1)
      this.currentStep--;

  }


  importerTypesSelectorData: FormDropdownModel[] =
    [
      {
        value: 'Data Import',
        name: 'Data Import'
      },
      {
        value: 'Data Export',
        name: 'Data Export'
      },
    ];
  columnTypesSelectorData: FormDropdownModel[] =
    [
      
      {
        value: 'Text',
        name: 'Text'
      },
      {
        value: 'Number',
        name: 'Number'
      },
      {
        value: 'Date',
        name: 'Date'
      },
      {
        value: 'Boolean',
        name: 'Boolean'
      }
      // {
      //   value: 'bigint',
      //   name: 'Big Int'
      // },

      // {
      //   value: 'bit',
      //   name: 'Bit'
      // },

      // {
      //   value: 'datetime',
      //   name: 'Date Time'
      // },

      // {
      //   value: 'float',
      //   name: 'Number - Float'
      // },

      // {
      //   value: 'int',
      //   name: 'Number -Int'
      // },

      // {
      //   value: 'text',
      //   name: 'Text'
      // },
      // {
      //   value: 'nvarchar',
      //   name: 'Text - NVarChar'
      // }
    ];
}


