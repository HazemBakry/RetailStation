import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { FilterItem, FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { PagedResponseModel } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';
import { ImporterName } from 'src/app/components/SystemSettings/models/DataImporter';
import { MerchantItemModel } from 'src/app/components/Shared/models/MerchantItemModel';
import { MerchantService } from 'src/app/components/Website/services/merchant.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-merchant-items',
  templateUrl: './merchant-items.component.html',
  styleUrls: ['./merchant-items.component.css']
})
export class MerchantItemsComponent implements OnInit {
  TitleList = ['الموردين', 'بيانات الأصناف'];
  unitsSelectorData: GeneralSelectorModel[] = [];
  merchantsSelectorData: GeneralSelectorModel[] = [];
  itemCategoriesSelectorData: GeneralSelectorModel[] = [];
  categoriesData: GeneralSelectorModel[] = [];
  defaultImage: string = `${environment.systemUrl}${environment.defaultImage}`;

  selectedmerchantItemId: number;

  MerchantItemModel: MerchantItemModel = {} as MerchantItemModel;
  filterList: FilterModel[] = [];
  pagedResponseModel: PagedResponseModel<MerchantItemModel[]> = {
    results: [],
    filterList: [],
    pageSize: 20,
    currentPage: 1,
    searchText: ''
  };
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  showExportLoader: boolean = false;
  importerName: string = ImporterName.MerchantItems;
  public formGroup: FormGroup;
  public formErrors = {
    merchantItemId: '',
    itemId: '',
    merchantId: '',
    nameAR: '',
    nameEN: '',
    unitId: '',
    purchaseUnitId: '',
    itemCategoryId: '',
    price: '',
    offerPrice: '',
    price10: '',
    price100: '',
    price1000: '',
    quantity: '',
    minimumOrderQuantity: '',
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
  constructor(private modalService: NgbModal, private merchantService: MerchantService,
    private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.sharedService.GetItemCategoriesSelector().subscribe((data: FormDropdownModel[]) => {
      this.itemCategoriesSelectorData = data;
      this.categoriesData = data;
    });
    this.loadData();
    this.loadFilters();
  }

  loadData() {
    this.showLoader = true;
    this.merchantService.GetMerchantItems_Data(this.pagedResponseModel).subscribe(data => {
      this.pagedResponseModel.results = data.results;
      this.pagedResponseModel.totalCount = data.totalCount;

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  loadFilters() {
    // this.showLoader = true;
    this.merchantService.GetMerchantItems_Filters(this.pagedResponseModel).subscribe(data => {
      this.filterList = data;

      // this.showLoader = false;
    }, err => {
      // this.showLoader = false;
    }, () => {
      // this.showLoader = false;
    });
  }

  exportData(categoryId: number = 0) {
    this.showExportLoader = true;
    this.merchantService.ExportMerchantItems(this.pagedResponseModel, categoryId).subscribe((data: ActionsResponseModel) => {
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

  filterChecked(filterItems: FilterItem[]) {
    this.pagedResponseModel.filterList = filterItems;
    this.loadData();
  }

  pageChanged(obj: any) {
    this.pagedResponseModel.currentPage = obj.page;
    this.loadData();
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

  openNewItemSidePanel(content: any, MerchantItemModel: MerchantItemModel = null) {

    this.loadSelectors();

    this.isUpdate = false;
    this.buildForm();
    if (MerchantItemModel)
      this.fillEditForm(MerchantItemModel);

    this.formGroup.patchValue({ employeeId: this.selectedCategoryId });
    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });

    // this.offcanvasService.open(content, { panelClass: 'add-new-panel', position: 'end' });
  }

  buildForm() {
    this.formGroup = this.form.group({
      merchantItemId: [null],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      unitId: [null, [Validators.required]],
      purchaseUnitId: [null],
      itemCategoryId: [null],
      price: [null, [Validators.required, CustomValidators.regexPattern(RegexType.currency)]],
      offerPrice: [null, [CustomValidators.regexPattern(RegexType.currency)]],
      price10: [null, [CustomValidators.regexPattern(RegexType.currency)]],
      price100: [null, [CustomValidators.regexPattern(RegexType.currency)]],
      price1000: [null, [CustomValidators.regexPattern(RegexType.currency)]],
      quantity: [null, [Validators.required, CustomValidators.regexPattern(RegexType.numeric)]],
      minimumOrderQuantity: [null, [CustomValidators.regexPattern(RegexType.numeric)]],
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
    this.MerchantItemModel = this.formGroup.value;
    this.formData = new FormData();
    if (this.imageFile != null) {
      this.formData.append('image', this.imageFile);
    }
    Object.keys(this.formGroup.value).forEach(key => {
      if (key != 'image' && this.formGroup.value[key] != undefined)
        this.formData.append(key, this.formGroup.value[key]);
    });
    if (this.MerchantItemModel.merchantItemId)
      this.editItem();
    else
      this.addNewItem();
  }

  addNewItem() {
    this.showAddLoader = true;
    this.merchantService.AddNewMerchantItem(this.formData).subscribe((data: ActionsResponseModel) => {
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
    this.merchantService.EditMerchantItem(this.MerchantItemModel.merchantItemId, this.formData).subscribe((data: ActionsResponseModel) => {
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
    this.merchantService.ChangeMerchantItemActiveStatus(ItemId).subscribe(data => {
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


  fillEditForm(MerchantItemModel: MerchantItemModel) {
    this.isUpdate = true;
    this.formGroup.patchValue({
      merchantItemId: MerchantItemModel.merchantItemId,
      itemId: MerchantItemModel.itemId,
      merchantId: MerchantItemModel.merchantId,
      nameAR: MerchantItemModel.nameAR,
      nameEN: MerchantItemModel.nameEN,
      unitId: MerchantItemModel.unitId,
      purchaseUnitId: MerchantItemModel.purchaseUnitId,
      itemCategoryId: MerchantItemModel.itemCategoryId,
      price: MerchantItemModel.price,
      offerPrice: MerchantItemModel.offerPrice,
      price10: MerchantItemModel.price10,
      price100: MerchantItemModel.price100,
      price1000: MerchantItemModel.price1000,
      quantity: MerchantItemModel.quantity,
      minimumOrderQuantity: MerchantItemModel.minimumOrderQuantity,
      isActive: MerchantItemModel.isActive,
      purchasePrice: MerchantItemModel.purchasePrice,
      itemTypeId: MerchantItemModel.itemTypeId

    });
  }


  openDeleteModal(content: any, merchantItemId: number) {
    this.selectedmerchantItemId = merchantItemId;
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

  deleteItem() {
    this.showAddLoader = true;
    this.merchantService.DeleteMerchantItem(this.selectedmerchantItemId).subscribe(data => {

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
  importerFileChanged(file: File) {
    if (file) {
      this.showAddLoader = true;
      var formData = new FormData();
      formData.append('importFile', file);
      this.merchantService.ImportMerchantItemsFile(this.importerName, formData).subscribe((data: ActionsResponseModel) => {
        if (data?.isSuccess) {
          if (data.url) {
            this.sharedService.urlDownloadOrOpen(data.url);
          }
          //this.formGroup?.reset();
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
  }

}


