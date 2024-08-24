import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from '../../services/inventory.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { OrderModel } from '../../models/inventory';

@Component({
  selector: 'app-add-delivery-order',
  templateUrl: './add-delivery-order.component.html',
  styleUrls: ['./add-delivery-order.component.css']
})

export class AddDeliveryOrderComponent implements OnInit {
  InventoryList: any[] = [];
  BranchesList: any[] = [];
  ProductsList: any[] = [];
  notes: any;
  BranchId: any;
  InventoryId: any;
  BranchName = 'الفروع';
  InventoryName = 'المخازن';
  clearAllProducts: boolean = false;

  constructor(private inventoryService: InventoryService,
    private purchaseService: PurchaseService,
    private modalService: NgbModal,
    private toaster: ToastrService
  ) { }

  ngOnInit(): void {
    this.getInventoryList();
    this.getBranchesList();
  }

  getInventoryList() {
    this.inventoryService.GetInventoryList().subscribe(data => {
      this.InventoryList = data;
    });
  }

  getBranchesList() {
    this.purchaseService.GetBranchesData().subscribe(data => {
      this.BranchesList = data;
    });
  }

  getSelectedBranch(item: any) {
    this.BranchId = item.branchId;
  }

  getSelectedInventory(item: any) {
    this.InventoryId = item.inventoryId;
  }

  getSelectedProductsList(products: any[]) {
    this.ProductsList = products;
  }

  addNewDeliveryOrder() {
    if (!this.InventoryId || !this.BranchId) {
      this.toaster.warning('Please Select Inventory');
      return;
    }

    if (this.ProductsList.length == 0) {
      this.toaster.warning('Please Enter Items');
      return;
    }

    let model: OrderModel = {} as OrderModel;
    model.branchId = this.BranchId;
    model.inventoryId = this.InventoryId;
    model.totalValue = this.ProductsList.reduce((prev, next) => prev + next.totalValue, 0);
    model.notes = this.notes;
    model.items = this.ProductsList;

    this.inventoryService.CreateNewDeliveryOrder(model).subscribe(data => {
      if (data?.status) {
        this.clearAllFields();
        this.toaster.success(data?.message);
      } else {
        this.toaster.error(data?.message);
      }
    });
  }

  clearAllFields() {
    this.BranchId = '';
    this.BranchId = '';
    this.notes = '';
    this.BranchName = 'الفروع';
    this.ProductsList = [];
    this.clearAllProducts = !this.clearAllProducts;
  }
}