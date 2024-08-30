import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CreateModifyReturnsModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';
import { PurchaseOrderModel } from '../../models/PurchaseOrder';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { InventoryService } from 'src/app/components/Inventory/services/inventory.service';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { OrderProductModel } from 'src/app/components/Inventory/models/inventory';
import { ItemModel } from 'src/app/components/Inventory/models/Item';

@Component({
  selector: 'app-add-purchase-order',
  templateUrl: './add-purchase-order.component.html',
  styleUrls: ['./add-purchase-order.component.css']
})
export class AddPurchaseOrderComponent implements OnInit {

  SuppliersList: any[] = [];
  BranchesList: any[] = [];
  ProductsList: any[] = [];
  orderProducts : OrderProductModel[]=[];
  notes: any;
  BranchId: any;
  SupplierId: any;
  ItemsBySupplier: any[] = [];
  InvoiceNumber = '-';
  BranchName = 'الفروع';
  SupplierName = 'الموردين';
  clearAllProducts: boolean = false;
  showLoader: boolean = false;
  FilterModel: FilterModel = {
    currentPage: 1,
    pageSize: 25
  };

  constructor(private purchaseService: PurchaseService,
    private inventoryService: InventoryService,
    private sharedService: SharedService,
    private modalService: NgbModal,
    private toaster: ToastrService) { }

  ngOnInit(): void {
    this.getBranchesData();
    this.getSuppliersData();
  }

  getSuppliersData() {
    this.sharedService.GetSuppliersSelector().subscribe(data => {
      this.SuppliersList = data;
    });
  }

  getBranchesData() {
    this.sharedService.GetBranchesSelector().subscribe(data => {
      this.BranchesList = data;
    });
  }

  getSelectedBranch(id: any) {
    this.BranchId = id;
  }

  getSelectedSupplier(id: any) {
    this.SupplierId = id;
  }

  getSelectedProductsList(products: any[]) {
    this.ProductsList = products;
    // console.log(" ~ this.ProductsList:", this.ProductsList);
  }

  getSupplierItemsBySupplierId() {
    this.orderProducts =[];
    if(!this.SupplierId)
    {
      this.toaster.warning('please select supplier');
      return;
    }
    this.inventoryService.GetItemsBySupplierId(this.SupplierId).subscribe(data => {
      debugger;

      if (data && data.length > 0) {
        this.orderProducts = this.mapItemToOrderProduct(data);
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  mapItemToOrderProduct(arrayOfItems: ItemModel[]): OrderProductModel[] {
    return arrayOfItems.map(x => this.mapSingleItemToOrderProduct(x));
  }

  private mapSingleItemToOrderProduct(x: ItemModel): OrderProductModel {
    return {
      itemId: x.itemId,
      itemNameAR: x.nameAR,
      itemNameEN: x.nameEN,
      isActive: x.isActive,
      unitNameAR: x.unitName,
      unitNameEN: x.unitName,
      unitId: x.unitId,
      price:x.cost,
      quantity : 0,
      totalValue :0
    };
  }

  createNewPurchaseOrder() {
    if (!this.BranchId) {
      this.toaster.warning('Please Select Branch');
      return;
    }

    if(this.orderProducts.length === 0) {
      this.toaster.warning('Please Enter Items');
      return;
    }

    let model: PurchaseOrderModel = {} as PurchaseOrderModel;

    model.branchId = this.BranchId;
    model.supplierId = this.SupplierId;
    model.notes = this.notes;
    model.items = this.ProductsList;

    this.purchaseService.CreateNewPurchaseOrder(model).subscribe((data: CreateModifyReturnsModel) => {
      if (data?.status) {
        this.ClearAllFields();
        // this.InvoiceNumber = data.item2;
        this.toaster.success(data?.message);
      } else {
        this.toaster.error(data?.message);
      }
    });
  }


  ClearAllFields() {
    this.InvoiceNumber = '-';
    this.SupplierId = '';
    this.BranchId = '';
    this.BranchId = '';
    // this.activeTab = 'Item'
    this.notes = '';
    this.BranchName = 'الفروع';
    this.SupplierName = 'الموردين';
    this.ProductsList = [];
    this.clearAllProducts = !this.clearAllProducts;
    // this.AddNewItem = {};
    // this.EditQuantityList = [];
  }
}
