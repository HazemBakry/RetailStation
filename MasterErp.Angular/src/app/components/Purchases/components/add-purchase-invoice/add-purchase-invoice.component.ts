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
import { InventoryService } from 'src/app/components/Inventory/services/inventory.service';
import { ItemModel } from 'src/app/components/Inventory/models/Item';
import { GeneralOrderDetailsModel } from 'src/app/components/Inventory/models/GeneralOrderModel ';
import { MaterialReceiptModel } from 'src/app/components/Inventory/models/MaterialReceiptModel';
import { PurchaseInvoiceModel } from '../../models/PurchaseInvoiceModel';

@Component({
  selector: 'app-add-purchase-invoice',
  templateUrl: './add-purchase-invoice.component.html',
  styleUrls: ['./add-purchase-invoice.component.css']
})

export class AddPurchaseInvoiceComponent implements OnInit {
  TitleList = ['المشتريات', 'إنشاء فاتورة مشتريات'];
  purchaseInvoiceId: number;
  purchaseInvoiceModel: PurchaseInvoiceModel = {} as PurchaseInvoiceModel;
  orderDetails: GeneralOrderDetailsModel[] = [];
  isUpdate: boolean = false;
  clearAllProducts: boolean = false;

  suppliersSelectorData: FormDropdownModel[] = [];
  invoiceTypesSelectorData: FormDropdownModel[] = [];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  supplierImageFile: File;
  formData: FormData = new FormData();
  public formGroup: FormGroup;

  selectedSupplierId: number;

  constructor(private acRoute: ActivatedRoute, private router: Router, private modalService: NgbModal, private inventoryService: InventoryService,
    private purchaseService: PurchaseService, private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }


  ngOnInit(): void {
    this.loadSelectors();
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.InvoiceId) {
        this.initNewForm();
        this.purchaseInvoiceId = params.InvoiceId;
        this.getPurchaseInvoiceDetailsById();
        this.getPurchaseInvoiceProducts();
      } else if (params.MaterialReceiptId) {
        this.getMaterialReceiptProducts([params.MaterialReceiptId]);
      }
    })


    this.initNewForm();


  }

  getPurchaseInvoiceDetailsById() {
    this.showLoader = true;
    this.purchaseService.GetPurchaseInvoiceDetailsById(this.purchaseInvoiceId).subscribe((data: PurchaseInvoiceModel) => {
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
      this.orderDetails = data;
      if (this.orderDetails.length > 0) {
        // this.formGroup.patchValue({orderDetails:this.orderDetails});
      }
      // this.initNewForm(this.receiveOrderModel);

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  searchOrderSelected(ord: MaterialReceiptModel[]) {
    if (ord?.length) {
      var orderIds = ord.map(b => b.materialReceiptId);
      this.getMaterialReceiptProducts(orderIds)
    }
    else {
      this.orderDetails = []
    }
  }
  getSelectedProductsList(products: GeneralOrderDetailsModel[]) {
    this.formGroup.patchValue({ orderDetails: products });
    this.orderDetails = products;
  }
  getMaterialReceiptProducts(materialReceiptIds: number[]) {

    this.showLoader = true;
    this.inventoryService.GetMaterialReceiptProducts_Data(materialReceiptIds).subscribe((data: GeneralOrderDetailsModel[]) => {
      if (data) {
        this.orderDetails = data;
        this.formGroup.patchValue({ materialReceiptIds: materialReceiptIds });
        //this.formGroup.patchValue({ materialReceiptId: orderIds });
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  initNewForm(purchaseInvoiceModel: PurchaseInvoiceModel = null) {
    this.orderDetails = [];
    this.clearAllProducts = !this.clearAllProducts;
    this.isUpdate = false;
    this.buildForm();
    if (purchaseInvoiceModel)
      this.fillEditForm(purchaseInvoiceModel);
  }

  buildForm() {
    this.formGroup = this.form.group({
      purchaseInvoiceId: [null],
      docNumber: [null],
      orderNumber: [null],
      orderDate: [null],
      dueDate: [null, [Validators.required]],
      orderTypeId: [null, [Validators.required]],
      supplierId: [null, [Validators.required]],
      materialReceiptId: [null, [Validators.required]],
      orderDetails: [[] as GeneralOrderDetailsModel[], [Validators.required, Validators.minLength(1)]],
      notes: [null],

    });

    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
  }


  savePurchaseInvoice() {
    if (this.orderDetails.length === 0)
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
        if (data.id) {
          this.purchaseInvoiceId = data.id;
          this.goToPage(this.purchaseInvoiceId);
        }
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
    this.orderDetails = [];
    if (!this.selectedSupplierId) {
      this.toaster.warning('please select supplier');
      return;
    }
    this.inventoryService.GetItemsBySupplierId(this.selectedSupplierId).subscribe(data => {
      if (data && data.length > 0) {
        this.orderDetails = this.mapItemToOrderProduct(data);
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

  fillEditForm(purchaseInvoiceModel: PurchaseInvoiceModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      purchaseInvoiceId: purchaseInvoiceModel.purchaseInvoiceId,
      supplierId: purchaseInvoiceModel.supplierId,
      notes: purchaseInvoiceModel.notes,
      orderDate: this.datePipe.transform(purchaseInvoiceModel.orderDate, 'yyyy-MM-dd'),
      dueDate: this.datePipe.transform(purchaseInvoiceModel.dueDate, 'yyyy-MM-dd'),
      docNumber: purchaseInvoiceModel.docNumber,
      orderNumber: purchaseInvoiceModel.orderNumber,
      orderTypeId: purchaseInvoiceModel.orderTypeId,
      materialReceiptIds: purchaseInvoiceModel.materialReceiptIds,
    });
  }
  openSaveModal(content: any) {
    if (this.orderDetails.length === 0)
      this.toaster.warning('لا يوجد اصناف');

    if (!this.validateForm()) {
      return;
    }
    this.modalService.open(content, { centered: true, size: 'md' });
  }
  goToPage(id: number) {
    if (id) {
      this.router.navigate([], {
        relativeTo: this.acRoute,
        queryParams: { PurchaseOrderId: id },
        queryParamsHandling: 'merge'
      });
    }
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
    purchaseInvoiceId: '',
    orderDetails: '',
    notes: '',
    dueDate: '',
    docNumber: '',
    orderNumber: '',
    orderDate: '',
    orderTypeId: '',
    materialReceiptIds: '',

  };


}