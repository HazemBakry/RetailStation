import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { DatePipe } from '@angular/common';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { ActionsResponseModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';
import { OrderModel, OrderProductModel } from 'src/app/components/Inventory/models/inventory';
import { InventoryService } from 'src/app/components/Inventory/services/inventory.service';
import { ItemModel } from 'src/app/components/Inventory/models/Item';

@Component({
  selector: 'app-add-purchase-order',
  templateUrl: './add-purchase-order.component.html',
  styleUrls: ['./add-purchase-order.component.css']
})

export class AddPurchaseOrderComponent implements OnInit {
  purchaseOrderId: number;
  purchaseOrderModel: OrderModel = {} as OrderModel;
  orderProducts: OrderProductModel[] = [];
  isUpdate: boolean = false;
  clearAllProducts: boolean = false;

  suppliersSelectorData: FormDropdownModel[] = [];
  branchesSelectorData: FormDropdownModel[] = [];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  supplierImageFile: File;
  formData: FormData = new FormData();
  public formGroup: FormGroup;

  selectedPurchaseInvoice: OrderModel = {} as OrderModel;
  selectedSupplierId: number;
  constructor(private acRoute: ActivatedRoute, private router: Router, private modalService: NgbModal, private inventoryService: InventoryService,
    private purchaseService: PurchaseService, private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }


  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.PurchaseOrderId) {
        this.purchaseOrderId = params.PurchaseOrderId;
        this.getPurchaseOrderDetailsById();
        this.getPurchaseOrderProducts();
      }
    })


    this.initNewForm();

    this.loadSelectors();
  }

  getPurchaseOrderDetailsById() {
    this.showLoader = true;
    this.purchaseService.GetPurchaseOrderDetailsById(this.purchaseOrderId).subscribe((data: OrderModel) => {
      if (data) {
        this.purchaseOrderModel = data;
        // this.getPurchaseOrderProducts();
        // this.initNewForm(this.purchaseOrderModel);
        this.fillEditForm(this.purchaseOrderModel);
        if (data.secondaryOrderId) {
        }
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }


  getPurchaseOrderProducts() {
    this.showLoader = true;
    this.purchaseService.GetPurchaseOrderProducts_Data(this.purchaseOrderId).subscribe((data: OrderProductModel[]) => {
      this.orderProducts = data;
      if (this.orderProducts.length > 0) {
        // this.formGroup.patchValue({orderProducts:this.orderProducts});
      }
      // this.initNewForm(this.purchaseOrderModel);

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  searchInvoiceSelected(inv: OrderModel) {
    this.selectedPurchaseInvoice = inv;
    this.getPurchaseInvoiceProducts();
  }
  getSelectedProductsList(products: OrderProductModel[]) {
    this.formGroup.patchValue({ orderProducts: products });
    this.orderProducts = products;
  }
  getPurchaseInvoiceProducts() {
    this.showLoader = true;
    this.purchaseService.GetPurchaseInvoiceProducts_Data(this.selectedPurchaseInvoice.orderId).subscribe((data: OrderProductModel[]) => {
      if (data) {
        this.orderProducts = data;
        // this.formGroup.patchValue({orderProducts:this.orderProducts});
        this.formGroup.patchValue({ secondaryOrderId: this.selectedPurchaseInvoice.orderId });

      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  initNewForm(orderModel: OrderModel = null) {
    this.selectedPurchaseInvoice = {} as OrderModel;
    this.orderProducts = [];
    this.clearAllProducts = !this.clearAllProducts;
    this.isUpdate = false;
    this.buildForm();
    if (orderModel)
      this.fillEditForm(orderModel);
  }

  buildForm() {
    this.formGroup = this.form.group({
      orderId: [null],
      // orderDate: [null, [Validators.required]],
      supplierId: [null, [Validators.required]],
      // branchId: [null, [Validators.required]],
      orderProducts: [[] as OrderProductModel[], [Validators.required, Validators.minLength(1)]],
      notes: [null],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
  }


  savePurchaseOrder() {
    if (this.orderProducts.length === 0)
      this.toaster.warning('لا يوجد اصناف');

    if (!this.validateForm()) {
      return;
    }
    this.purchaseOrderModel = this.formGroup.value;

    if (this.purchaseOrderId)
      this.editPurchaseOrder();
    else
      this.addNewPurchaseOrder();
  }

  addNewPurchaseOrder() {
    this.showAddLoader = true;
    this.purchaseService.AddNewPurchaseOrder(this.purchaseOrderModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        // this.formGroup?.reset();
        this.initNewForm();
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

  editPurchaseOrder() {
    this.showAddLoader = true;
    this.purchaseService.EditPurchaseOrder(this.purchaseOrderId, this.purchaseOrderModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.initNewForm();
        this.toaster.success(data?.message);
        this.getPurchaseOrderDetailsById();
        this.getPurchaseOrderProducts();
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
    this.sharedService.GetSuppliersSelector().subscribe((data: FormDropdownModel[]) => {
      this.suppliersSelectorData = data;
    });
    this.sharedService.GetBranchesSelector().subscribe((data: FormDropdownModel[]) => {
      this.branchesSelectorData = data;
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

  fillEditForm(orderModel: OrderModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      orderId: orderModel.orderId,
      supplierId: orderModel.supplierId,
      orderDate: this.datePipe.transform(orderModel.orderDate, 'yyyy-MM-dd'),
      // secondaryOrderId: orderModel.secondaryOrderId,
      branchId: orderModel.branchId,
      notes: orderModel.notes

    });
  }
  getSelectedSupplier(supplierId) {
    this.selectedSupplierId = supplierId;
  }
  getSupplierItemsBySupplierId() {
    this.orderProducts =[];
    if(!this.selectedSupplierId)
    {
      this.toaster.warning('please select supplier');
      return;
    }
    this.inventoryService.GetItemsBySupplierId(this.selectedSupplierId).subscribe(data => {
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
  public formErrors = {
    supplierId: '',
    orderId: '',
    secondaryOrderId: '',
    branchId: '',
    orderDate: '',
    orderProducts: '',
    notes: ''
  };


}