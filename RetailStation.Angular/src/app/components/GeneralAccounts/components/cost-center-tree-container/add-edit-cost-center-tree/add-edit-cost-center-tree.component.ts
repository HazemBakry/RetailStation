import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { DatePipe } from '@angular/common';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';
import { CostCenterTreeModel } from '../../../models/GeneralAccounts/CostCenter';
import { GeneralAccountService } from '../../../services/general-account.service';


@Component({
  selector: 'app-add-edit-cost-center-tree',
  templateUrl: './add-edit-cost-center-tree.component.html',
  styleUrls: ['./add-edit-cost-center-tree.component.css']
})
export class AddEditCostCenterTreeComponent implements OnInit, OnChanges {
  @Input() isUpdate: boolean = false;
  @Input() costCenterModel: CostCenterTreeModel = {} as CostCenterTreeModel;

  @Output() dataUpdated = new EventEmitter<boolean>();

  showLoader: boolean = false;
  parentCostCenterSelectorData: FormDropdownModel[] = [];
  selectedCostCenterId: number = null;
  public formGroup: FormGroup;

  public formErrors = {
    costCenterId: '',
    costCenterNumber: '',
    nameAR: '',
    nameEN: '',
    parentId: '',
    isPost: '',
    isActive: '',
    notes: '',
  };
  constructor(private modalService: NgbModal,
    private sharedService: SharedService,
    private _GeneralAccountService: GeneralAccountService,
    private toaster: ToastrService,
    private form: FormBuilder,
    private _FormService: FormService,
    private lookupService: LookupService,
    private datePipe: DatePipe,) { }



  ngOnInit(): void {
    this.initNewForm();
    this.loadSelectors();

  }

  ngOnChanges(changes): void {
    if (changes && !changes.costCenterModel.firstChange) {
      if (this.costCenterModel && this.costCenterModel != null) {
        this.initNewForm(this.costCenterModel);
      }
    }
  }



  initNewForm(costCenterModel: CostCenterTreeModel = null) {

    this.isUpdate = false;
    this.buildForm();
    if (costCenterModel)
      this.fillEditForm(costCenterModel);
    else
    {
      this.costCenterModel = {} as CostCenterTreeModel;
      this.generateCostCenterNumber();
    }

  }
  buildForm() {

    this.formGroup = this.form.group({
      costCenterId: [null],
      costCenterNumber: [null],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      parentId: [null],
      isPost: [false, [Validators.required]],
      isActive: [true, [Validators.required]],
      notes: [null],

    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
    this.formGroup.get('parentId').valueChanges.subscribe((parentId:number) => {
      if(!this.isUpdate)
      {
        this.generateCostCenterNumber(parentId ? parentId :0);
      }
    });
  }

  saveCostCenter() {
    if (!this.validateForm()) {
      return;
    }
    this.costCenterModel = this.formGroup.value;

    if (this.costCenterModel?.costCenterId)
      this.editCostCenter();
    else
      this.addNewCostCenter();
  }

  addNewCostCenter() {

    this.showLoader = true;
    this._GeneralAccountService
      .CreateNewCostCenter(this.costCenterModel).subscribe(data => {
        if (data?.isSuccess) {
          this.formGroup?.reset();
          this.toaster.success(data?.message);
          this.dataUpdated.emit(true);
        }
        else {
          this.toaster.error(data?.message);
        }
        this.showLoader = false;
      }, err => {
        this.showLoader = false;
      }, () => {
        this.showLoader = false;
      });



  }

  editCostCenter() {

    this.showLoader = true;
    this._GeneralAccountService
      .UpdateCostCenterTree(this.costCenterModel.costCenterId, this.costCenterModel).subscribe(data => {

        if (data?.isSuccess) {
          this.initNewForm();
          this.toaster.success(data?.message);
          this.dataUpdated.emit(true);
        }
        else {
          this.toaster.error(data?.message);
        }
        this.showLoader = false;
      }, err => {
        this.showLoader = false;
      }, () => {
        this.showLoader = false;
      });


  }

  generateCostCenterNumber(parentCostCenterId: number = 0) {
    this._GeneralAccountService
      .GenerateCostCenterNumber(parentCostCenterId).subscribe(data => {
        if (data) {
          this.formGroup?.patchValue({ costCenterNumber: data });
        }

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


  fillEditForm(costCenterModel: CostCenterTreeModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      costCenterId: costCenterModel.costCenterId,
      costCenterNumber: costCenterModel.costCenterNumber,
      nameAR: costCenterModel.nameAR,
      nameEN: costCenterModel.nameEN,
      parentId: costCenterModel.parentId,
      isPost: costCenterModel.isPost,
      isActive: costCenterModel.isActive

    });
  }
  loadSelectors() {
    this.sharedService.GetCostCenterSelector(true).subscribe(data => {
      this.parentCostCenterSelectorData = data;
    });
  }






  getSelectedParentCostCenter(costCenter: CostCenterTreeModel) {
    this.costCenterModel.parentId = costCenter.costCenterId;
    this.costCenterModel.costLevel = costCenter.costLevel + 1;
  }
}

