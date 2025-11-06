
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { FilterItem } from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';
import { ItemModel } from 'src/app/components/Shared/models/ItemModel';
import { AdminService } from '../../services/Admin.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  TitleList = ['التشغيل', 'بيانات الأصناف'];
  unitsSelectorData: GeneralSelectorModel[] = [];
  merchantsSelectorData: GeneralSelectorModel[] = [];
  itemCategoriesSelectorData: GeneralSelectorModel[] = [];
  categoriesData: GeneralSelectorModel[] = [];

  selectedItemId: number;

  itemModel: ItemModel = {} as ItemModel;
  pagedResponseModel: PagedResponseModel<ItemModel[]> = {
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
    itemId: '',
    nameAR: '',
    nameEN: '',
    unitId: '',
    purchaseUnitId: '',
    itemCategoryId: '',
    cost: '',
    convertRatio: '',
    isActive: '',
    yield: '',
    purchasePrice: '',
    itemTypeId: '',
    image: '',

  };

  selectedCategoryId: number = 0;
  isUpdate: boolean = false;
  imageFile: File;
  formData: FormData = new FormData();

  constructor(private modalService: NgbModal,
    private adminService: AdminService,
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
    this.adminService.GetItemsData(this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });


  }

  exportData(categoryId: number = 0) {
    this.showExportLoader = true;
    this.adminService.ExportItems(this.pagedResponseModel, categoryId).subscribe((data: ActionsResponseModel) => {
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
    this.pagedResponseModel.filterList = [];
    this.selectedCategoryId = catId;
    if (catId > 0) {
      let catFilter: FilterItem = {
        categoryName: 'CategoryId',
        itemFlag: catId,
        itemKey: catId,
        itemValue: catId,
      }
      this.pagedResponseModel.filterList = [catFilter];
    }

    this.loadData();
  }

  open(content: any) {
    this.modalService.open(content, { size: 'lg', centered: true, scrollable: true });
  }

  openNewItemSidePanel(content: any, itemModel: ItemModel = null) {

    this.loadSelectors();

    this.isUpdate = false;
    this.buildForm();
    if (itemModel)
      this.fillEditForm(itemModel);

    this.formGroup.patchValue({ employeeId: this.selectedCategoryId });
    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });

    // this.offcanvasService.open(content, { panelClass: 'add-new-panel', position: 'end' });
  }

  buildForm() {
    this.formGroup = this.form.group({
      itemId: [null],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      unitId: [null, [Validators.required]],
      purchaseUnitId: [null],
      itemCategoryId: [null],
      cost: [null, [Validators.required, CustomValidators.regexPattern(RegexType.currency)]],
      convertRatio: [null],
      isActive: [true],
      yield: [null],
      purchasePrice: [null],
      itemTypeId: [null],
      image: [null],


    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
  }
  onFileChange(event: any) {
    this.imageFile = event.target.files[0];
    //this.imageFileName = event.target.files[0].name;
  }
  saveItem() {
    if (!this.validateForm()) {
      return;
    }
    this.itemModel = this.formGroup.value;

    this.formData = new FormData();
    if (this.imageFile != null) {
      this.formData.append('image', this.imageFile);
    }
    Object.keys(this.formGroup.value).forEach(key => {
      if (key != 'image' && this.formGroup.value[key] != undefined)
        this.formData.append(key, this.formGroup.value[key]);
    });
    if (this.itemModel.itemId)
      this.editItem();
    else
      this.addNewItem();
  }

  addNewItem() {
    this.showAddLoader = true;
    this.adminService.AddNewItem(this.formData).subscribe((data: ActionsResponseModel) => {
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
    this.adminService.EditItem(this.itemModel.itemId, this.formData).subscribe((data: ActionsResponseModel) => {
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
    this.adminService.ChangeItemActiveStatus(ItemId).subscribe(data => {
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


  fillEditForm(itemModel: ItemModel) {
    this.isUpdate = true;
    this.formGroup.patchValue({
      itemId: itemModel.itemId,
      nameAR: itemModel.nameAR,
      nameEN: itemModel.nameEN,
      unitId: itemModel.unitId,
      purchaseUnitId: itemModel.purchaseUnitId,
      itemCategoryId: itemModel.itemCategoryId,
      convertRatio: itemModel.convertRatio,
      cost: itemModel.cost,
      isActive: itemModel.isActive ?? false,
      yield: itemModel.yield,
      purchasePrice: itemModel.purchasePrice,
      itemTypeId: itemModel.itemTypeId

    });
  }


  openDeleteModal(content: any, itemId: number) {
    this.selectedItemId = itemId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  loadSelectors() {
    this.sharedService.GetMerchantsSelector().subscribe((data: FormDropdownModel[]) => {
      this.merchantsSelectorData = data;
    });

    this.sharedService.GetUnitsSelector().subscribe((data: FormDropdownModel[]) => {
      this.unitsSelectorData = data;
    });
  }

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.loadData();
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.loadData();
  }


  deleteItem() {
    this.showAddLoader = true;
    this.adminService.DeleteItem(this.selectedItemId).subscribe(data => {

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


