import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';
import { UnitModel } from '../../../models/Operation/UnitModel';
import { OperationService } from '../../../services/operation.service';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';

@Component({
  selector: 'app-item-units',
  templateUrl: './item-units.component.html',
  styleUrls: ['./item-units.component.css']
})
export class ItemUnitsComponent  implements OnInit {



  TitleList = ['التشغيل', 'الوحدات'];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  pagedResponse: PagedResponseModel<UnitModel[]> = {
    currentPage: 1,
    pageSize: 10,
    results: [],
    filterList: [],
    searchText: ''
  }
  unitModel: UnitModel = {} as UnitModel;

  constructor(private operationService: OperationService, private toaster: ToastrService,
    private sharedService: SharedService,
    private modalService: NgbModal,
    private lookupService: LookupService,
    private form: FormBuilder,
    private _FormService: FormService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader = true;
    this.operationService.GetUnits_Data(this.pagedResponse).subscribe((data: any) => {
      this.pagedResponse.results = data.results;
      this.pagedResponse.totalCount = data.totalCount;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }



  pageChanged(obj: any) {
    this.pagedResponse.currentPage = obj.page;
    this.loadData();
  }



  ////////////////////////////  Actions /////////////////////////////


  isUpdate: boolean = false;
  public formGroup: FormGroup;
  public formErrors = {
    unitId: '',
    nameAR: '',
    nameEN: '',
    isActive: '',
    code: '',
    description: ''

  };
  selectedUnitId: number;
  openAddModal(content: any, UnitModel: UnitModel = null) {
    this.loadSelectors();
    this.isUpdate = false;
    this.buildForm();
    if (UnitModel)
      this.fillEditForm(UnitModel);

    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });
  }
  loadSelectors() {

  }
  buildForm() {
    this.formGroup = this.form.group({
      unitId: [null],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      description: [null],
      isActive: [true, [Validators.required]],
      code: [null],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
  }

  saveRecord() {
    if (!this.validateForm()) {
      return;
    }
    this.unitModel = this.formGroup.value;
    if (this.unitModel?.unitId)
      this.editNewUnit();
    else
      this.addNewUnit();
  }

  addNewUnit() {

    this.showAddLoader = true;
    this.operationService
      .CreateNewUnit(this.unitModel).subscribe(data => {
        if (data?.isSuccess) {
          this.formGroup?.reset();
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

  editNewUnit() {


    this.showAddLoader = true;
    this.operationService
      .EditUnit(this.unitModel.unitId, this.unitModel).subscribe(data => {

        if (data?.isSuccess) {
          // this.formGroup?.reset();
          this.isUpdate = false;
          this.modalService?.dismissAll();
          this.formGroup?.reset();
          this.toaster.success(data?.message);

          this.loadData();
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

  validateForm(): boolean {
    this._FormService.markFormGroupTouched(this.formGroup);
    if (this.formGroup.valid) {
      return true;
    } else {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, false)
      return false;
    }
  }

  fillEditForm(UnitModel: UnitModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      unitId: UnitModel.unitId,
      nameAR: UnitModel.nameAR,
      nameEN: UnitModel.nameEN,
      code: UnitModel.code,
      isActive: UnitModel.isActive,
      description: UnitModel.description,
    });
  }
  openDeleteModal(content: any, id: number) {
    this.selectedUnitId = id;
    this.modalService.open(content, { centered: true, size: 'sm' });
  }

  deleteUnit() {
    this.showAddLoader = true;
    this.operationService.DeleteUnit(this.selectedUnitId).subscribe(data => {

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


}
