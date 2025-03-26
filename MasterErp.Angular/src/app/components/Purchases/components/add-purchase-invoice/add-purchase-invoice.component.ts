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
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { OrderModel } from 'src/app/components/Inventory/models/inventory';
import { InventoryService } from 'src/app/components/Inventory/services/inventory.service';
import { ItemModel } from 'src/app/components/Inventory/models/Item';
import { GeneralOrderDetailsModel } from 'src/app/components/Inventory/models/GeneralOrderModel ';

@Component({
  selector: 'app-add-purchase-invoice',
  templateUrl: './add-purchase-invoice.component.html',
  styleUrls: ['./add-purchase-invoice.component.css']
})

export class AddPurchaseInvoiceComponent implements OnInit {
  TitleList = ['المشتريات', 'إضافة فاتورة مشتريات'];
  purchaseInvoiceId: number;
  purchaseInvoiceModel: OrderModel = {} as OrderModel;
  orderProducts: GeneralOrderDetailsModel[] = [];
  isUpdate: boolean = false;
  clearAllProducts: boolean = false;

  suppliersSelectorData: FormDropdownModel[] = [];
  invoiceTypesSelectorData: FormDropdownModel[] = [];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  supplierImageFile: File;
  formData: FormData = new FormData();
  public formGroup: FormGroup;

  selectedMaterialReceipt: OrderModel[] = [];
  selectedSupplierId: number;

  constructor(private acRoute: ActivatedRoute, private router: Router, private modalService: NgbModal, private inventoryService: InventoryService,
    private purchaseService: PurchaseService, private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }


  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.InvoiceId) {
        this.purchaseInvoiceId = params.InvoiceId;
        this.getPurchaseInvoiceDetailsById();
        this.getPurchaseInvoiceProducts();
      }
    })


    this.initNewForm();

    this.loadSelectors();
  }

  getPurchaseInvoiceDetailsById() {
    this.showLoader = true;
    this.purchaseService.GetPurchaseInvoiceDetailsById(this.purchaseInvoiceId).subscribe((data: OrderModel) => {
      if (data) {
        this.purchaseInvoiceModel = data;
        // this.getPurchaseInvoiceProducts();
        // this.initNewForm(this.receiveOrderModel);
        this.fillEditForm(this.purchaseInvoiceModel)
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  getPurchaseInvoiceProducts() {
    this.showLoader = true;
    this.purchaseService.GetPurchaseInvoiceProducts_Data(this.purchaseInvoiceId).subscribe((data: GeneralOrderDetailsModel[]) => {
      this.orderProducts = data;
      if (this.orderProducts.length > 0) {
        // this.formGroup.patchValue({orderProducts:this.orderProducts});
      }
      // this.initNewForm(this.receiveOrderModel);

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  searchOrderSelected(ord: OrderModel[]) {
    this.selectedMaterialReceipt = ord;
    this.getMaterialReceiptProducts();
  }
  getSelectedProductsList(products: GeneralOrderDetailsModel[]) {
    this.formGroup.patchValue({ orderProducts: products });
    this.orderProducts = products;
  }
  getMaterialReceiptProducts() {
    var orderIds: number[] = [];
    this.selectedMaterialReceipt.forEach(ord => {
      if (!orderIds.some(x => x == ord.orderId))
        orderIds.push(ord.orderId);
    });
    this.showLoader = true;
    this.inventoryService.GetMaterialReceiptProducts_Data(orderIds).subscribe((data: GeneralOrderDetailsModel[]) => {
      if (data) {
        this.orderProducts = data;
        this.formGroup.patchValue({ secondaryOrderIds: orderIds });
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  initNewForm(orderModel: OrderModel = null) {
    this.selectedMaterialReceipt = [];
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
      docNumber: [null],
      orderNumber: [null],
      orderDate: [null],
      dueDate: [null, [Validators.required]],
      orderTypeId: [null, [Validators.required]],
      supplierId: [null, [Validators.required]],
      secondaryOrderIds: [[], [Validators.required]],
      orderProducts: [[] as GeneralOrderDetailsModel[], [Validators.required, Validators.minLength(1)]],
      description: [null],

    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
  }


  savePurchaseInvoice() {
    if (this.orderProducts.length === 0)
      this.toaster.warning('لا يوجد اصناف');

    if (!this.validateForm()) {
      return;
    }
    this.purchaseInvoiceModel = this.formGroup.value;

    if (this.purchaseInvoiceId)
      this.editPurchaseInvoice();
    else
      this.addNewPurchaseInvoice();
  }

  addNewPurchaseInvoice() {
    this.showAddLoader = true;
    this.purchaseService.AddNewPurchaseInvoice(this.purchaseInvoiceModel).subscribe((data: ActionsResponseModel) => {
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

  editPurchaseInvoice() {
    this.showAddLoader = true;
    this.purchaseService.EditPurchaseInvoice(this.purchaseInvoiceId, this.purchaseInvoiceModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.initNewForm();
        this.toaster.success(data?.message);
        this.getPurchaseInvoiceDetailsById();
        this.getPurchaseInvoiceProducts();
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
  getSelectedSupplier(supplierId) {
    this.selectedSupplierId = supplierId;
  }
  getSupplierItemsBySupplierId() {
    this.orderProducts = [];
    if (!this.selectedSupplierId) {
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

  loadSelectors() {
    this.sharedService.GetSuppliersSelector().subscribe(data => {
      this.suppliersSelectorData = data;
    });

    this.sharedService.GetPurchaseInvoiceTypesSelector().subscribe(data => {
      this.invoiceTypesSelectorData = data;
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
      purchaseOrderId: orderModel.purchaseOrderId,
      storeId: orderModel.storeId,
      description: orderModel.description,
      orderDate: this.datePipe.transform(orderModel.orderDate, 'yyyy-MM-dd'),
      dueDate: this.datePipe.transform(orderModel.dueDate, 'yyyy-MM-dd'),
      docNumber: orderModel.docNumber,
      orderNumber: orderModel.orderNumber,
      orderTypeId: orderModel.orderTypeId,
      secondaryOrderIds: orderModel.secondaryOrderIds,
    });
  }

  mapItemToOrderProduct(arrayOfItems: ItemModel[]): GeneralOrderDetailsModel[] {
    return arrayOfItems.map(x => this.mapSingleItemToOrderProduct(x));
  }

  private mapSingleItemToOrderProduct(x: ItemModel): GeneralOrderDetailsModel {
    return {
      itemId: x.itemId,
      itemNameAR: x.nameAR,
      itemNameEN: x.nameEN,
      // isActive: x.isActive,
      unitNameAR: x.unitName,
      unitNameEN: x.unitName,
      unitId: x.unitId,
      price: x.cost,
      quantity: 0,
      totalValue: 0
    };
  }
  public formErrors = {
    supplierId: '',
    orderId: '',
    orderProducts: '',
    description: '',
    dueDate: '',
    docNumber: '',
    orderNumber: '',
    orderDate: '',
    orderTypeId: '',
    secondaryOrderIds: '',
  };


}