import { Component, OnInit } from '@angular/core';
import { ItemModel } from '../../models/Item';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService } from '../../services/inventory.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})

export class AddItemComponent implements OnInit {
  itemModel: ItemModel = {} as ItemModel;
  isUpdate: boolean = false;
  categoriesSelectorData: FormDropdownModel[] = [];
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  ItemImage: File;
  itemId: number;
  formData: FormData = new FormData();
  public formGroup: FormGroup;
  responseModel:PagedResponseDTO<ItemModel[]>={
    results:[],
    filterList:[],
    pageSize: 10,
    currentPage:1,
    searchText:''

  };
  constructor(private acRoute: ActivatedRoute, private router: Router, private modalService: NgbModal,
    private inventoryService: InventoryService, private sharedService: SharedService, private form: FormBuilder,
    private _FormService: FormService, private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.ItemId) {
        this.itemId = params.ItemId;
        this.getItemDetailsById();
      }
    })

    this.initNewForm();
    this.loadSelectors();
  }

  goToItems(){
    this.router.navigateByUrl("./items");
  }

  getItemDetailsById() {
    this.showLoader = true;
    this.inventoryService.GetItemDetailsById(this.itemId).subscribe((data: ItemModel) => {
      if (data) {
        this.itemModel = data;
        this.initNewForm(this.itemModel);
      }

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  initNewForm(itemModel: ItemModel = null) {
    this.isUpdate = false;
    this.buildForm();
    if (itemModel)
      this.fillEditForm(itemModel);
  }

  buildForm() {
    this.formGroup = this.form.group({      
      itemId: [null ,[Validators.required]],
      nameAR: [null],
      nameEN: [null],
      unitId: [null],
      purchaseUnitId: [null],
      itemCategoryId: [null],
      cost: [null],
      convertRatio: [null],
      isActive: [true],
      itemSupplierIds:[null],
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

    if (this.itemId)
      this.editItem();
    else
      this.addNewSupplier();
  }

  addNewSupplier() {
    this.showAddLoader = true;
    this.inventoryService.AddNewItem(this.itemModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
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

  editItem() {
    this.showAddLoader = true;
    this.inventoryService.EditItem(this.itemId, this.itemModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        // this.initNewForm();
        this.toaster.success(data?.message);
        this.getItemDetailsById();
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

  loadSelectors() {
    this.sharedService.GetItemCategoriesSelector().subscribe(data => {
      this.categoriesSelectorData = data;
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
      itemSupplierIds: itemModel.supplierIds,
      yield : itemModel.yield,
      purchasePrice: itemModel.purchasePrice,
      itemTypeId : itemModel.itemTypeId

    });
  }


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
    itemSupplierIds:'',
    yield : '',
    purchasePrice: '',
    itemTypeId : ''
  };



}


