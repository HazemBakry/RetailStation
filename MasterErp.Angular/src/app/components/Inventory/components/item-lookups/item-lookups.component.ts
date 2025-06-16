import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { FilterItem, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { ToastrService } from 'ngx-toastr';
import { PagedResponseDTO } from 'src/app/components/Shared/models/PagedResponseDTO';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { CustomValidators, RegexType } from 'src/app/components/Shared/services/custom-validators';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { LookupService } from 'src/app/components/Shared/services/lookup.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { ItemLookupDetailsModel, ItemLookupModel } from '../../models/ItemLookupModel';
import { InventoryService } from '../../services/inventory.service';
import { ItemModel } from '../../models/Item';


@Component({
  selector: 'app-item-lookups',
  templateUrl: './item-lookups.component.html',
  styleUrls: ['./item-lookups.component.css']
})
export class ItemLookupsComponent implements OnInit {
  VacationData: any[] = [];
  itemLookupSelectorData: GeneralSelectorModel[] = [];
  branchesSelector: GeneralSelectorModel[] = [];
  itemLookupModel: ItemLookupModel = {} as ItemLookupModel;
  showLoader: boolean = false;
  showAddLoader: boolean = false;
  public formGroup: FormGroup;
  selectedItemLookupId: number = null;
  isUpdate: boolean = false;

  pagedResponse: PagedResponseDTO<ItemLookupModel[]> = {
    results: [],
    filterList: [],
    pageSize: 10,
    currentPage: 1,
    searchText: ''
  };
  public formErrors = {
    itemLookupId: '',
    nameEN: '',
    nameAR: '',
    branchId: '',
    notes: ''
  };
  itemResponseModel: PagedResponseDTO<ItemModel[]> = {
    results: [],
    filterList: [],
    pageSize: 20,
    currentPage: 1,
    searchText: ''
  };
  constructor(private modalService: NgbModal, private inventoryService: InventoryService, private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.loadItemsData()
    this.getItemLookups();
  }
  loadItemsData() {
    this.showLoader = true;
    this.inventoryService.GetItemsData(this.itemResponseModel).subscribe(data => {
      this.itemResponseModel.results = data.results;
      this.itemResponseModel.totalCount = data.totalCount;
      this.disableAddedItems();
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });


  }

  getItemLookups() {
    if (!this.checkLookup())
      return;

    this.showLoader = true;
    this.inventoryService.GetItemLookups_Data(this.pagedResponse).subscribe(data => {
      this.pagedResponse.results = data.results;
      this.pagedResponse.totalCount = data.totalCount;
      this.itemLookupSelectorData = data.results?.map(x => {
        return { name: x.nameAR ?? x.nameEN, value: x.itemLookupId }
      });

      this.selectedItemLookupId = null;
      this.itemLookupModel = null;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  pageChanged(obj: any) {
    this.pagedResponse.currentPage = obj.page;
    this.getItemLookups();
  }
  pageItemsChanged(obj: any) {
    this.itemResponseModel.currentPage = obj.page;
    this.loadItemsData();
  }

  checkLookup() {
    return true
    if (!this.selectedItemLookupId) {
      this.toaster.warning('من فضلك اختر من قائمة القوالب', 'تحذير');
      return false;
    }
    return true;
  }

  selectedItemLookupChanged(itemLookupId: number) {
    this.selectedItemLookupId = itemLookupId;
    if (this.selectedItemLookupId) {
      this.itemLookupModel = this.pagedResponse.results.find(x => x.itemLookupId == itemLookupId);
    } else {
      this.itemLookupModel = null;
    }
    this.disableAddedItems();
  }
  disableAddedItems() {
    if (this.itemLookupModel?.items?.length >= 0) {
      this.itemResponseModel.results.forEach(x => {
        x.disabled = this.itemLookupModel?.items.find(i => x.itemId == i.itemId) ? true : false;
      })
    }
  }
  moveItemToLookup(item: ItemModel) {
    if (this.itemLookupModel?.items.length >= 0) {
      if (!this.itemLookupModel?.items.some(x => x.itemId == item.itemId)) {
        var obj: ItemLookupDetailsModel = {
          itemId: item.itemId,
          itemNameEN: item.nameEN,
          itemNameAR: item.nameAR,
          displayOrder: 0,
          quantity: 0,
          unitNameEN: item.unitName,
          unitNameAR: item.unitName,
          price: item.cost,
        }
        this.itemLookupModel?.items.push(obj);
      } else {
        this.toaster.warning('هذا الصنف موجود');
      }
    } else {
      this.toaster.warning('برجاء اختيار القالب');

    }
    this.disableAddedItems();
  }
  openAddModal(content: any, itemLookupModel: ItemLookupModel = null) {
    this.loadSelectors();
    this.isUpdate = false;
    this.buildForm();
    if (itemLookupModel)
      this.fillEditForm(itemLookupModel);

    this.modalService.open(content, { centered: true, size: 'lg', fullscreen: 'lg' });
  }
  loadSelectors() {
    this.sharedService.GetBranchesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.branchesSelector = data;
    });
  }
  buildForm() {

    this.formGroup = this.form.group({
      itemLookupId: [null],
      nameEN: [null, [Validators.required]],
      nameAR: [null, [Validators.required]],
      branchId: [null],
      notes: [null],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });

  }

  saveItemLookup() {
    if (!this.validateForm()) {
      return;
    }
    this.itemLookupModel = this.formGroup.value;
    if (this.itemLookupModel?.itemLookupId)
      this.editItemLookup();
    else
      this.addNewItemLookup();
  }

  addNewItemLookup() {

    this.showAddLoader = true;
    this.inventoryService.CreateNewItemLookup(this.itemLookupModel).subscribe(data => {
      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.formGroup?.reset();
        this.toaster.success(data?.message);
        this.getItemLookups();
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

  editItemLookup() {

    this.showAddLoader = true;
    this.inventoryService.EditItemLookup(this.itemLookupModel.itemLookupId, this.itemLookupModel).subscribe(data => {

      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.modalService?.dismissAll();
        this.getItemLookups();
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

  validateForm(): boolean {
    this._FormService.markFormGroupTouched(this.formGroup);
    if (this.formGroup.valid) {
      return true;
    } else {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, false)
      return false;
    }
  }


  fillEditForm(itemLookupModel: ItemLookupModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      itemLookupId: itemLookupModel.itemLookupId,
      nameEN: itemLookupModel.nameEN,
      nameAR: itemLookupModel.nameAR,
      branchId: itemLookupModel.branchId,
      notes: itemLookupModel.notes
    });
  }


  openDeleteModal(content: any, itemLookupId: number) {
    this.selectedItemLookupId = itemLookupId;
    this.modalService.open(content, { centered: true, size: 'md' });
  }





  deleteItemLookup() {
    this.showAddLoader = true;
    this.inventoryService.DeleteItemLookup(this.selectedItemLookupId).subscribe(data => {
      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getItemLookups();
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


  addItemsToLookup() {
    if (!this.itemLookupModel?.itemLookupId || !this.itemLookupModel?.items.length) {
      this.toaster.warning('من فضلك اختر من قائمة القوالب', 'تحذير');
      return false;
    }
    this.showAddLoader = true;
    this.inventoryService.AddItemsToLookup(this.itemLookupModel.itemLookupId, this.itemLookupModel.items).subscribe(data => {

      if (data?.isSuccess) {
        this.modalService?.dismissAll();
        this.getItemLookups();
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
  removeItemDetails(index: number, list: any[]) {
    if (list?.length) {
      list.splice(index, 1);
    }
    this.disableAddedItems();
  }

}

