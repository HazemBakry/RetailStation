import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from '../../services/inventory.service';
import { CategorySortModel } from '../../models/categorySort';
import { ItemCategoryModel } from '../../models/itemCategory';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';

@Component({
  selector: 'app-items-category',
  templateUrl: './items-category.component.html',
  styleUrls: ['./items-category.component.css']
})
export class ItemsCategoryComponent implements OnInit {
  itemCategories: any[] = [];
  categoryModel: ItemCategoryModel = {} as ItemCategoryModel;
  URLs: any[] = [];
  ImagesName: any[] = [];
  TitleList = ['System Difinitions', 'Food Categories'];
  totalCount: any;
  totalPages: any;
  pageSize: any = 20;
  currentPage: any = 1;
  StartIndex = 0;
  CategoryId: any;
  DefaultImage = '../../../../assets/defaultimg.jpeg'
  PrinterName: string;
  Lang = 'en';
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
    supplierIds: '',
    yield: '',
    purchasePrice: '',
    itemType: ''
  };

  constructor(private inventoryService: InventoryService,
    private toaster: ToastrService,
    private modalService: NgbModal,
    private form: FormBuilder,
    private formService: FormService) { }

  ngOnInit(): void {
    this.getItemCategories();
  }

  buildForm() {
    this.formGroup = this.form.group({
      itemId: [null],
      nameAR: [null, [Validators.required]],
      nameEN: [null, [Validators.required]],
      unitId: [null, [Validators.required]],
      purchaseUnitId: [null],
      itemCategoryId: [null],
      cost: [null, [Validators.required]],
      convertRatio: [null],
      isActive: [true],
      supplierIds: [[]],
      yield: [null],
      purchasePrice: [null],
      itemType: [null]

    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this.formService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  getItemCategories() {
    this.showLoader = true;
    this.inventoryService.GetItemCategories().subscribe(data => {
      this.itemCategories = data;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  openNewSidePanel(content: any, catModel: ItemCategoryModel = null) {
    this.getItemCategories();
    this.isUpdate = false;
    this.buildForm();
    if (catModel)
      this.fillEditForm(catModel);
    this.formGroup.patchValue({ itemCategoryId: this.itemCategoryId });
    this.modalService.open(content, { centered: true, size: 'xl', fullscreen: 'lg' });
  }

  pageChanged(obj: any) {
    this.currentPage = obj.page;
    this.StartIndex = (this.currentPage - 1) * this.pageSize;
    //this.pagingItemCategories = this.itemCategoriesData.slice(this.StartIndex, this.StartIndex + this.pageSize);
  }

  changeCategoryStatus(CategoryId: any) {
    this.inventoryService.ChangeCategoryStatus(CategoryId).subscribe(data => {
      if (data) {
        if (this.Lang == 'en')
          this.toaster.success('Change Status Successfully');
        else
          this.toaster.success('تم تغيير الحالة');
      } else {
        if (this.Lang == 'en')
          this.toaster.error('Change Status Field!');
        else
          this.toaster.error('لقد حدث خطا');
      }
    });
  }

  open(content: any, category: any) {
    this.URLs = [];
    this.PrinterName = this.Lang == 'en' ? 'Printers' : 'الطابعات';
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
      this.editItem();
    else
      this.addNewItem();
  }

  addNewItem() {
    this.showAddLoader = true;
    this.inventoryService.AddNewCategory(this.categoryModel).subscribe((data: ActionsResponseModel) => {
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

  editItem() {
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


  itemCategoryId?: number | null;
  nameAR: string;
  nameEN: string;
  description: string;
  displayOrder: number | null;
  IsActive: boolean | null;

  fillEditForm(categoryModel: ItemCategoryModel) {
    this.isUpdate = true;
    this.formGroup.patchValue({
      itemCategoryId: categoryModel.itemCategoryId,
      nameAR: categoryModel.nameAR,
      nameEN: categoryModel.nameEN,
      description: categoryModel.description,
      displayOrder: categoryModel.displayOrder,
      IsActive: categoryModel.IsActive
    });
  }

  deleteCategory() {
    this.inventoryService.DeleteItemCategory(this.CategoryId).subscribe(data => {
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
  saveOrderSortOrder() {
    this.itemCategories.forEach((el, i) => el.displayOrder = i + 1)
    const SortedItems: CategorySortModel[] = [...this.itemCategories.map(x => {
      return { categoryId: x.foodCategoryId, displayOrder: x.displayOrder }
    })];
    this.changeCategoriesSortOrder(SortedItems);
  }

  changeCategoriesSortOrder(SortedItems: CategorySortModel[]) {
    this.inventoryService.ChangeCategoriesSortOrder(SortedItems).subscribe(data => {
      if (data) {
        if (this.Lang == 'en')
          this.toaster.success('Change Sort Successfully');
        else
          this.toaster.success('تم تغيير الترتيب');
        this.getItemCategories();
      } else {
        if (this.Lang == 'en')
          this.toaster.error('Change Sort Field!');
        else
          this.toaster.error('لقد حدث خطا');
      }
    });
  }

}
