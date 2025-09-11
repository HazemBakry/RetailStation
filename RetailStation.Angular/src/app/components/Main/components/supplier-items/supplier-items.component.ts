import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { PagedResponseDTO, PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { SupplierModel } from 'src/app/components/Purchases/models/SupplierModel';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { SupplierItemModel } from '../../models/SupplierItemModel';
import { SupplierService } from '../../services/supplier.service';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';

@Component({
  selector: 'app-supplier-items',
  templateUrl: './supplier-items.component.html',
  styleUrls: ['./supplier-items.component.css']
})
export class SupplierItemsComponent implements OnInit {
  TitleList = ['الموردين', 'بيانات الأصناف'];
  unitsSelectorData: GeneralSelectorModel[] = [];
  suppliersSelectorData: GeneralSelectorModel[] = [];
  itemCategoriesSelectorData: GeneralSelectorModel[] = [];
  categoriesData: GeneralSelectorModel[] = [];

  selectedSupplierItemId: number;

  supplierItemModel: SupplierItemModel = {} as SupplierItemModel;
  itemResponseModel: PagedResponseModel<SupplierItemModel[]> = {
    results: [],
    filterList: [],
    pageSize: 20,
    currentPage: 1,
    searchText: ''
  };
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  showExportLoader: boolean = false;

  public formGroup: FormGroup;
  public formErrors = {
    supplierItemId: '',
    itemId: '',
    supplierId: '',
    nameAR: '',
    nameEN: '',
    unitId: '',
    purchaseUnitId: '',
    itemCategoryId: '',
    price: '',
    quantity: '',
    convertRatio: '',
    isActive: '',
    yield: '',
    purchasePrice: '',
    itemTypeId: ''
  };

  selectedCategoryId: number = 0;
  isUpdate: boolean = false;
  constructor(private modalService: NgbModal, private supplierService: SupplierService,
    private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.sharedService.GetItemCategoriesSelector().subscribe((data: FormDropdownModel[]) => {
      this.itemCategoriesSelectorData = data;
      this.categoriesData = data;
    });
    this.loadData();
  }

  loadData() {
    this.showLoader = true;
    this.supplierService.GetSupplierItemsData(this.itemResponseModel).subscribe(data => {
      this.itemResponseModel.results = data.results;
      this.itemResponseModel.totalCount = data.totalCount;

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });


  }

  exportData(categoryId: number = 0) {
    this.showExportLoader = true;
    this.supplierService.ExportSupplierItems(this.itemResponseModel, categoryId).subscribe((data: ActionsResponseModel) => {
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

  filterCategory(catId) {
    this.itemResponseModel.filterList = [];
    this.selectedCategoryId = catId;
    if (catId > 0) {
      let catFilter: FilterItem = {
        categoryName: 'CategoryId',
        itemFlag: catId,
        itemKey: catId,
        itemValue: catId,
      }
      this.itemResponseModel.filterList = [catFilter];
    }

    this.loadData();
  }

  open(content: any) {
    this.modalService.open(content, { size: 'lg', centered: true, scrollable: true });
  }

  openNewItemSidePanel(content: any, supplierItemModel: SupplierItemModel = null) {

    this.loadSelectors();

    this.isUpdate = false;
    this.buildForm();
    if (supplierItemModel)
      this.fillEditForm(supplierItemModel);

    this.formGroup.patchValue({ employeeId: this.selectedCategoryId });
    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });

    // this.offcanvasService.open(content, { panelClass: 'add-new-panel', position: 'end' });
  }

  buildForm() {
    this.formGroup = this.form.group({
      supplierItemId: [null],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      unitId: [null, [Validators.required]],
      purchaseUnitId: [null],
      itemCategoryId: [null],
      price: [null, [Validators.required, CustomValidators.regexPattern(RegexType.currency)]],
      quantity: [null, [Validators.required, CustomValidators.regexPattern(RegexType.numeric)]],
      convertRatio: [null],
      isActive: [true],
      yield: [null],
      purchasePrice: [null],
      itemTypeId: [null]

    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  saveItem() {
    if (!this.validateForm()) {
      return;
    }
    this.supplierItemModel = this.formGroup.value;

    if (this.supplierItemModel.supplierItemId)
      this.editItem();
    else
      this.addNewItem();
  }

  addNewItem() {
    this.showAddLoader = true;
    this.supplierService.AddNewSupplierItem(this.supplierItemModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.toaster.success(data?.message);
        this.modalService?.dismissAll();
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

  editItem() {
    this.showAddLoader = true;
    this.supplierService.EditSupplierItem(this.supplierItemModel.supplierItemId, this.supplierItemModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        // this.initNewForm();
        this.toaster.success(data?.message);
        this.modalService?.dismissAll();
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
  changeItemStatus(ItemId: number) {
    this.supplierService.ChangeSupplierItemActiveStatus(ItemId).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
        this.loadData();
      } else {
        this.toaster.error(data.message);
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


  fillEditForm(supplierItemModel: SupplierItemModel) {
    this.isUpdate = true;
    this.formGroup.patchValue({
      supplierItemId: supplierItemModel.supplierItemId,
      itemId: supplierItemModel.itemId,
      supplierId: supplierItemModel.supplierId,
      nameAR: supplierItemModel.nameAR,
      nameEN: supplierItemModel.nameEN,
      unitId: supplierItemModel.unitId,
      purchaseUnitId: supplierItemModel.purchaseUnitId,
      itemCategoryId: supplierItemModel.itemCategoryId,
      price: supplierItemModel.price,
      quantity: supplierItemModel.quantity,
      isActive: supplierItemModel.isActive,
      purchasePrice: supplierItemModel.purchasePrice,
      itemTypeId: supplierItemModel.itemTypeId

    });
  }


  openDeleteModal(content: any, supplierItemId: number) {
    this.selectedSupplierItemId = supplierItemId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  loadSelectors() {

    this.sharedService.GetSuppliersSelector().subscribe((data: FormDropdownModel[]) => {
      this.suppliersSelectorData = data;
    });

    this.sharedService.GetUnitsSelector().subscribe((data: FormDropdownModel[]) => {
      this.unitsSelectorData = data;
    });
  }

  filterChecked(filterItems: FilterItem[]) {
    this.itemResponseModel.filterList = filterItems;
    this.loadData();
  }

  pageChanged(obj: any) {
    this.itemResponseModel.currentPage = obj.page;
    this.loadData();
  }


  deleteItem() {
    this.showAddLoader = true;
    this.supplierService.DeleteSupplierItem(this.selectedSupplierItemId).subscribe(data => {

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
  itemSuppliers: SupplierModel[] = [];


}


