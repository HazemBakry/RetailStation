import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { UnitModel } from 'src/app/components/Shared/models/UnitModel';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { AdminService } from '../../services/Admin.service';

@Component({
  selector: 'app-item-units',
  templateUrl: './item-units.component.html',
  styleUrls: ['./item-units.component.css']
})
export class ItemUnitsComponent implements OnInit {
  TitleList = ['التشغيل', 'الوحدات'];
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  unitModel: UnitModel = {} as UnitModel;
  filterList: FilterItem[] = [];

  pagedResponseModel: PagedResponseModel<UnitModel[]> = {
    currentPage: 1,
    pageSize: 10,
    results: [],
    filterList: [],
    searchText: ''
  }

  constructor(private adminService: AdminService,
    private toaster: ToastrService,
    private modalService: NgbModal,
    private form: FormBuilder,
    private _FormService: FormService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.showLoader = true;
    this.adminService.GetUnits_Data(this.pagedResponseModel).subscribe((data: any) => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;
      this.showLoader = false;
    }, (err) => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    })
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.loadData();
  }

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
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
    this.adminService.CreateNewUnit(this.unitModel).subscribe(data => {
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
    this.adminService.EditUnit(this.unitModel.unitId, this.unitModel).subscribe(data => {

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
    this.adminService.DeleteUnit(this.selectedUnitId).subscribe(data => {
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
