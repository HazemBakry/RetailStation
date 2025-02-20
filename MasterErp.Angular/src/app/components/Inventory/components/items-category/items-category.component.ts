import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from '../../services/inventory.service';
import { CategorySortModel } from '../../models/categorySort';
import { ItemCategoryModel } from '../../models/itemCategory';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { SharedService } from 'src/app/components/Shared/services/shared.service';

@Component({
  selector: 'app-items-category',
  templateUrl: './items-category.component.html',
  styleUrls: ['./items-category.component.css']
})
export class ItemsCategoryComponent implements OnInit {
  TitleList = ['المخازن', 'مجموعات الأصناف'];
  itemCategories: any[] = [];
  categoryModel: ItemCategoryModel = {} as ItemCategoryModel;
  childAccountSelectorData: FormDropdownModel[] = [];
  URLs: any[] = [];
  ImagesName: any[] = [];
  totalCount: any;
  totalPages: any;
  pageSize: any = 20;
  currentPage: any = 1;
  StartIndex = 0;
  defaultImage = '../../../../assets/defaultimg.jpeg'
  printerName: string;
  lang = 'en';
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  isUpdate: boolean = false;
  responseModel: PagedResponseDTO<ItemCategoryModel[]> = {
    results: [],
    filterList: [],
    pageSize: 25,
    currentPage: 1,
    searchText: ''

  };
  selectedItemCategoryId?: number | null;

  public formGroup: FormGroup;
  public formErrors = {
    itemId: '',
    nameAR: '',
    nameEN: '',
    operationAccountId: '',
    managementAccountId: '',
    description: '',
    isActive: '',

  };

  constructor(private inventoryService: InventoryService,
    private toaster: ToastrService,
    private modalService: NgbModal,
    private form: FormBuilder,
    private sharedService: SharedService,
    private formService: FormService) { }

  ngOnInit(): void {
    this.getItemCategories();
  }

  buildForm() {
    this.formGroup = this.form.group({
      itemCategoryId: [null],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      operationAccountId: [null, [Validators.required]],
      managementAccountId: [null, [Validators.required]],
      description: [null],
      isActive: [true]

    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this.formService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  getItemCategories() {
    this.showLoader = true;
    this.inventoryService.GetItemCategories().subscribe((data: PagedResponseDTO<ItemCategoryModel[]>) => {
      this.responseModel.results = data.results;
      this.responseModel.totalCount = data.totalCount;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  openNewSidePanel(content: any, catModel: ItemCategoryModel = null) {
    this.loadSelectors();
    this.isUpdate = false;
    this.buildForm();
    if (catModel)
      this.fillEditForm(catModel);
    // this.formGroup.patchValue({ itemCategoryId: this.selectedItemCategoryId });
    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });
  }
  loadSelectors() {

    this.sharedService.GetChildAccountsSelector().subscribe((data: FormDropdownModel[]) => {
      this.childAccountSelectorData = data;
    });

  }

  pageChanged(obj: any) {
    this.currentPage = obj.page;
    this.StartIndex = (this.currentPage - 1) * this.pageSize;
    //this.pagingItemCategories = this.itemCategoriesData.slice(this.StartIndex, this.StartIndex + this.pageSize);
  }

  changeCategoryStatus(CategoryId: any) {
    this.inventoryService.ChangeItemCategoryActiveStatus(CategoryId).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
        this.getItemCategories();
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

  open(content: any, category: any) {
    this.URLs = [];
    this.printerName = this.lang == 'en' ? 'Printers' : 'الطابعات';
    this.formGroup.reset();
    if (category != null) {
      this.fillEditForm(category);
    }
    this.modalService.open(content, { size: 'xl', centered: true });
  }

  onSelectedFile(event: any) {
    this.URLs = [];
    this.formGroup.patchValue({ imageFile: event.target.files[0] });
    if (event.target.files) {
      for (let x = 0; x < event.target.files.length; x++) {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[x]);
        reader.onload = (events: any) => {
          this.URLs.push(events.target.result);
        }
      }
    }
    var files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.ImagesName.push(event.target.files[i].name);
    }

  }

  saveCategory() {
    if (!this.validateForm()) {
      return;
    }
    this.categoryModel = this.formGroup.value;

    if (this.categoryModel.itemCategoryId)
      this.editCategory();
    else
      this.addNewCategory();
  }

  addNewCategory() {
    this.showAddLoader = true;
    this.inventoryService.AddNewItemCategory(this.categoryModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.toaster.success(data?.message);
        this.modalService?.dismissAll();
        this.getItemCategories();

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

  editCategory() {

    this.showAddLoader = true;
    this.inventoryService.EditItemCategory(this.categoryModel.itemCategoryId, this.categoryModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        // this.initNewForm();
        this.toaster.success(data?.message);
        this.modalService?.dismissAll();
        this.getItemCategories();
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
    this.formService.markFormGroupTouched(this.formGroup);
    if (this.formGroup.valid) {
      return true;
    } else {
      this.formErrors = this.formService.validateForm(this.formGroup, this.formErrors, false)
      return false;
    }
  }




  fillEditForm(categoryModel: ItemCategoryModel) {
    this.isUpdate = true;
    this.formGroup.patchValue({
      itemCategoryId: categoryModel.itemCategoryId,
      nameAR: categoryModel.nameAR,
      nameEN: categoryModel.nameEN,
      operationAccountId: categoryModel.operationAccountId,
      managementAccountId: categoryModel.managementAccountId,
      description: categoryModel.description,
      displayOrder: categoryModel.displayOrder,
      IsActive: categoryModel.isActive
    });
  }
  openDeleteModal(content: any, itemId: number) {
    this.selectedItemCategoryId = itemId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  submitDeleteAction() {
    this.inventoryService.DeleteItemCategory(this.selectedItemCategoryId).subscribe(data => {
      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getItemCategories();
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


  public draggedOverIndex: number;
  private draggedIndex: number;
  private listIndex: number;
  lastSwap = "";
  XonDragStart(index, listIndex): void {
    this.listIndex = -1;
    this.draggedIndex = -1;
    this.draggedOverIndex = -1;
    this.lastSwap = "";
    this.draggedIndex = index;
    this.listIndex = listIndex;
  }
  XallowDrop($event, list, index, listIndex): void {

    this.draggedOverIndex = index;
    if (listIndex == this.listIndex) {
      $event.preventDefault();
      var swap = this.draggedIndex + "," + this.draggedOverIndex;
      if (this.lastSwap == swap || this.draggedIndex == this.draggedOverIndex)
        return;
      const item1 = list[this.draggedIndex];
      list.splice(this.draggedIndex, 1);
      list.splice(this.draggedOverIndex, 0, item1);

      this.draggedIndex = this.draggedOverIndex;
      this.draggedOverIndex = -1;
      this.lastSwap = swap;
    }

  }
  XonDrop($event, list, index, listIndex): void {

    $event.preventDefault();
    this.listIndex = -1;
    this.draggedIndex = -1;
    this.draggedOverIndex = -1;
    this.lastSwap = "";
  }
  saveCategoriesDisplayOrder() {
    this.responseModel.results.forEach((el, i) => el.displayOrder = i + 1)
    const SortedItems: CategorySortModel[] = [...this.responseModel.results.map(x => {
      return { categoryId: x.itemCategoryId, displayOrder: x.displayOrder }
    })];
    this.changeCategoriesDisplayOrder(SortedItems);
  }

  changeCategoriesDisplayOrder(SortedItems: CategorySortModel[]) {
    if (SortedItems.length == 0) return
    this.showAddLoader = true;
    this.inventoryService.ChangeCategoriesDisplayOrder(SortedItems).subscribe(data => {
      if (data.isSuccess) {
        this.toaster.success(data.message);
        this.getItemCategories();
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

}
