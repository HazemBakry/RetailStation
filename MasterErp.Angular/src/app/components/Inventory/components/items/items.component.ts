
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { FilterItem} from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { ItemModel } from '../../models/Item';
import { InventoryService } from '../../services/inventory.service';
import { ActionsResponseModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';
import { SupplierModel } from 'src/app/components/Purchases/models/SupplierModel';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  TitleList = ['المخازن', 'بيانات الأصناف'];
  unitsSelectorData: FormDropdownModel[] = [];
  suppliersSelectorData: FormDropdownModel[]=[];
  itemCategoriesSelectorData: FormDropdownModel[]=[];
  categoriesData: FormDropdownModel[]=[];

  selectedItemId: number;
  
  itemModel: ItemModel ={} as ItemModel;
  itemResponseModel:PagedResponseDTO<ItemModel[]>={
    results:[],
    filterList:[],
    pageSize: 25,
    currentPage:1,
    searchText:''

  };
  showLoader: boolean=false;
  showAddLoader: boolean=false;
  showExportLoader: boolean=false;

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
    supplierIds:'',
    yield : '',
    purchasePrice: '',
    itemTypeId : ''
  };

  selectedCategoryId:number=0;
  isUpdate: boolean=false;
  constructor(private modalService: NgbModal, private inventoryService: InventoryService,private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe,private toaster:ToastrService,private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.sharedService.GetItemCategoriesSelector().subscribe((data: FormDropdownModel[]) => {
      this.itemCategoriesSelectorData = data;
      this.categoriesData=data;
    });
    this.loadData();
  }
  loadData()
  {
    this.showLoader = true;
    this.inventoryService.GetItemsData(this.itemResponseModel).subscribe(data => {
      this.itemResponseModel.results = data.results;
      this.itemResponseModel.totalCount = data.totalCount;

      this.showLoader=false;
    }, err=>{
      this.showLoader=false;
    },()=>{
      this.showLoader=false;
    });

    
  }
  exportData(categoryId : number=0)
  {
    this.showExportLoader=true;
    this.inventoryService.ExportItems(this.itemResponseModel,categoryId).subscribe((data:ActionsResponseModel) => {
      if (data.isSuccess) {
        this.sharedService.urlDownloadOrOpen(data.url);
        this.toaster.success(data.message);
      } else {
        this.toaster.error(data.message);
      }
      

      this.showExportLoader=false;
    }, err=>{
      this.showExportLoader=false;
    },()=>{
      this.showExportLoader=false;
    });

    
  }

  filterCategory(catId)
  {
    this.itemResponseModel.filterList =[];
    this.selectedCategoryId=catId;
    if(catId > 0)
    {
      let catFilter:FilterItem={
        categoryName : 'CategoryId',
        itemFlag : catId,
        itemKey : catId,
        itemValue : catId,
      }
      this.itemResponseModel.filterList=[catFilter];
    }

    this.loadData();
  }
  open(content: any) {
		this.modalService.open(content, { size: 'lg', centered: true, scrollable: true });
	}

  openNewItemSidePanel(content: any,itemModel:ItemModel=null) {

    this.loadSelectors();

    this.isUpdate=false;
    this.buildForm();
    if(itemModel)
      this.fillEditForm(itemModel);

    this.formGroup.patchValue({employeeId:this.selectedCategoryId});
    this.modalService.open(content, { centered: true, size: 'lg',fullscreen:'lg' });

    // this.offcanvasService.open(content, { panelClass: 'add-new-panel', position: 'end' });
  }
  buildForm() {
    this.formGroup = this.form.group({      
      itemId: [null],
      nameAR: [null,[Validators.required]],
      nameEN: [null,[Validators.required]],
      unitId: [null,[Validators.required]],
      purchaseUnitId: [null],
      itemCategoryId: [null],
      cost: [null,[Validators.required]],
      convertRatio: [null],
      isActive: [true],
      supplierIds:[[]],
      yield : [null],
      purchasePrice: [null],
      itemTypeId : [null]

    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  saveItem() {
    if (!this.validateForm()) {
      return;
    }
    this.itemModel = this.formGroup.value;

    if (this.itemModel.itemId)
      this.editItem();
    else
      this.addNewItem();
  }

  addNewItem() {
    this.showAddLoader = true;
    this.inventoryService.AddNewItem(this.itemModel).subscribe((data: ActionsResponseModel) => {
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
    this.inventoryService.EditItem(this.itemModel.itemId, this.itemModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        // this.initNewForm();
        this.toaster.success(data?.message);
        this.modalService?.dismissAll();  
        this.loadData();      }
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
    this.inventoryService.ChangeItemActiveStatus(ItemId).subscribe(data => {
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
      isActive: itemModel.isActive,
      supplierIds: itemModel.supplierIds,
      yield : itemModel.yield,
      purchasePrice: itemModel.purchasePrice,
      itemTypeId : itemModel.itemTypeId

    });
  }


  openDeleteModal(content: any, itemId: number) {
    this.selectedItemId = itemId;
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
    this.showAddLoader=true;
    this.inventoryService.DeleteItem(this.selectedItemId).subscribe(data => {

      if(data?.isSuccess) {
        this.modalService?.dismissAll();
        this.loadData();
        this.toaster.success(data?.message);
      }
      else {
        this.toaster.error(data?.message);
      }
      this.showAddLoader=false;
    }, err=>{
      this.showAddLoader=false;
    },()=>{
      this.showAddLoader=false;
    });
  }
  itemSuppliers:SupplierModel[] = [];
  openSuppliersDialog(content: any,itemId:number) {

    this.getItemSuppliersByItemId(itemId);
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  openSuppliersSidePanel(content: any,itemId:number) {
    this.getItemSuppliersByItemId(itemId);
    this.offcanvasService.open(content, { panelClass: 'details-panel', position: 'end' });
  }
  getItemSuppliersByItemId(itemId:number)
  {
    this.itemSuppliers=[];
    this.inventoryService.GetSuppliersByItemId(itemId).subscribe(data => {
      if(data&&data.results.length>0) {
        this.itemSuppliers=data.results;
      }
      this.showAddLoader=false;
    }, err=>{
      this.showAddLoader=false;
    },()=>{
      this.showAddLoader=false;
    });
  }
}


