import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderDetailModel } from 'src/app/components/Shared/models/ItemModel';
import { SupplierReturnsVoucherModel } from 'src/app/components/Purchases/models/SupplierReturnsVoucherModel';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';

@Component({
  selector: 'app-create-supplier-returns-voucher',
  templateUrl: './add-supplier-returns-voucher.component.html',
  styleUrls: ['./add-supplier-returns-voucher.component.css'],
})
export class AddSupplierReturnsVoucherComponent implements OnInit {
  // BranchesList: any[] = [];
  SuppliersList: any[] = [];
  ProductsList: OrderDetailModel[] = [];
  ItemsBySupplier: OrderDetailModel[] = [];
  InvoiceNumber = '';
  itemsCount: number = 0;
  showLoader: boolean = false;
  isPercentage: boolean = false;
  discountValue: number;
  taxPercent: number = 0.15;
  clearAllProducts: boolean = false;
  supplierReturnsModel: SupplierReturnsVoucherModel =
    {} as SupplierReturnsVoucherModel;
  constructor(
    private sharedService: SharedService,
    private purchaseService: PurchaseService,
    private modalService: NgbModal,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    // this.GetBranchesData();
    this.GetSuppliersData();
  }

  // GetBranchesData() {
  //   this.purchaseService.GetBranchesData().subscribe((data) => {
  //     this.BranchesList = data;
  //   });
  // }

  GetSuppliersData() {
    this.sharedService.GetSuppliersSelector().subscribe((data) => {
      this.SuppliersList = data;
    });
  }
  GetSelectedProductsList(products: OrderDetailModel[]) {
    this.ProductsList = products;
    this.supplierReturnsModel.items = products;

  }

  // GetSelectedBranch(item: any) {
  //   this.supplierReturnsModel.branchId = item.branchId;
  // }
  GetSelectedSupplier(item: any) {
    this.supplierReturnsModel.supplierId = item.supplierId;
    
  }

  CreateNewSupplierReturnsVoucher() {
    if (!this.validateFields()) {
      return;
    }

    this.purchaseService
      .CreateNewSupplierReturnsVoucher(this.supplierReturnsModel)
      .subscribe((data: ActionsResponseModel) => {
        if (data?.status) {
          // this.ClearAllFields();
          this.supplierReturnsModel.invoiceNumber = data.id;
          this.toaster.success(data?.message);
        } else {
          this.toaster.error(data?.message);
        }
      });
  }

  validateFields(): boolean {
    let model: SupplierReturnsVoucherModel = this.supplierReturnsModel;

    if (
      model.items?.length == 0 ||
      !model.invoiceDate ||
      !model.supplierId 
    ) {
      this.toaster.warning('يرجي ملئ جميع الخانات');
      return false;
    }
    return true;
  }
  ClearAllFields() {
    this.InvoiceNumber = '';
    this.supplierReturnsModel = {} as SupplierReturnsVoucherModel;
    this.ProductsList = [];
    this.clearAllProducts = !this.clearAllProducts;
  }
  Print() {}
}
