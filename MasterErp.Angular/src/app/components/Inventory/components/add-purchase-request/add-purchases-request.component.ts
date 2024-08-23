import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CreateModifyReturnsModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { PurchaseRequestModel } from '../../models/PurchasesRequestModel';
import { OrderDetailModel } from 'src/app/components/Shared/models/ItemModel';
import { InventoryService } from '../../services/inventory.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';

@Component({
  selector: 'app-add-purchases-request',
  templateUrl: './add-purchases-request.component.html',
  styleUrls: ['./add-purchases-request.component.css']
})


export class AddPurchasesRequestComponent implements OnInit {
  BranchesList: any[] = [];
  ProductsList: OrderDetailModel[] = [];
  ItemsBySupplier: OrderDetailModel[] = [];
  showLoader: boolean = false;
  clearAllProducts: boolean = false;
  purchasesRequestModel: PurchaseRequestModel =
    {} as PurchaseRequestModel;
  constructor(
    private sharedService: SharedService,
    private inventoryService: InventoryService,
    private purchaseService: PurchaseService,
    private modalService: NgbModal,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.GetBranchesData();

  }
  GetBranchesData() {
    this.purchaseService.GetBranchesData().subscribe((data) => {
      this.BranchesList = data;
    });
  }
  GetSelectedProductsList(products: OrderDetailModel[]) {
    this.ProductsList = products;
    this.purchasesRequestModel.items = products;

  }

  GetSelectedBranch(item: any) {
    this.purchasesRequestModel.branchId = item.branchId;
  }


  CreateNewPurchasesRequest() {
    if (!this.validateFields()) {
      return;
    }

    this.inventoryService
      .CreateNewPurchasesRequest(this.purchasesRequestModel)
      .subscribe((data: CreateModifyReturnsModel) => {
        if (data?.status) {
          // this.ClearAllFields();
          this.purchasesRequestModel.requestNumber = data.id;
          this.toaster.success(data?.message);
        } else {
          this.toaster.error(data?.message);
        }
      });
  }

  validateFields(): boolean {
    let model: PurchaseRequestModel = this.purchasesRequestModel;

    if (
      model.items?.length == 0 ||
      !model.requestDate ||
      !model.branchId||
      !model.requestDate
    ) {
      this.toaster.warning('يرجي ملئ جميع الخانات');
      return false;
    }
    return true;
  }
  ClearAllFields() {
    this.purchasesRequestModel = {} as PurchaseRequestModel;
    this.ProductsList = [];
    this.clearAllProducts = !this.clearAllProducts;
  }
  Print() {}
}