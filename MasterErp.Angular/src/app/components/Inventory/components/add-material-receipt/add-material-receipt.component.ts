import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from '../../services/inventory.service';
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
import { GeneralOrderDetailsModel } from '../../models/GeneralOrderModel ';
import { MaterialReceiptModel } from '../../models/MaterialReceiptModel';
import { PurchaseOrderModel } from 'src/app/components/Purchases/models/PurchaseOrder';

@Component({
  selector: 'app-add-material-receipt',
  templateUrl: './add-material-receipt.component.html',
  styleUrls: ['./add-material-receipt.component.css']
})

export class AddMaterialReceiptComponent implements OnInit {
  TitleList = ['المخازن', 'انشاء أذن أضافة جديد'];
  materialReceiptId: number;
  materialReceiptModel: MaterialReceiptModel = {} as MaterialReceiptModel;
  orderDetails: GeneralOrderDetailsModel[] = [];
  isUpdate: boolean = false;
  clearAllProducts: boolean = false;

  suppliersSelectorData: FormDropdownModel[] = [];
  inventoriesSelectorData: FormDropdownModel[] = [];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  supplierImageFile: File;
  formData: FormData = new FormData();
  public formGroup: FormGroup;
  today: string;

  constructor(private acRoute: ActivatedRoute, private router: Router, private modalService: NgbModal, private inventoryService: InventoryService,
    private purchaseService: PurchaseService, private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) {
    this.today = this.datePipe.transform(new Date, 'yyyy-MM-dd');
  }


  ngOnInit(): void {

    this.loadSelectors();
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.MaterialReceiptId) {
        this.initNewForm();
        this.materialReceiptId = params.MaterialReceiptId;
        this.getMaterialReceiptDetailsById();
        this.getMaterialReceiptProducts();
      } else if (params.PurchaseOrderId) {
        this.getPurchaseOrderProducts(params.PurchaseOrderId);
      }
    });
    this.initNewForm();
  }

  getMaterialReceiptDetailsById() {
    this.showLoader = true;
    this.inventoryService.GetMaterialReceiptDetailsById(this.materialReceiptId).subscribe((data: MaterialReceiptModel) => {
      if (data) {
        this.materialReceiptModel = data;
        // this.getMaterialReceiptProducts();
        // this.initNewForm(this.materialReceiptModel);
        this.fillEditForm(this.materialReceiptModel)
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  getMaterialReceiptProducts() {
    this.showLoader = true;
    this.inventoryService.GetMaterialReceiptProducts_Data([this.materialReceiptId]).subscribe((data: GeneralOrderDetailsModel[]) => {
      this.orderDetails = data.map(product => ({ ...product, expireDate: this.datePipe.transform(product.expireDate, 'yyyy-MM-dd') }));

      if (this.orderDetails.length > 0) {
        // this.formGroup.patchValue({orderDetails:this.orderDetails});
      }
      // this.initNewForm(this.materialReceiptModel);

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  searchOrderSelected(ord: PurchaseOrderModel) {
    if (ord?.purchaseOrderId) {
      this.getPurchaseOrderProducts(ord?.purchaseOrderId)
    }
    else {
      this.orderDetails = []
    }
  }
  getSelectedProductsList(products: GeneralOrderDetailsModel[]) {
    this.formGroup.patchValue({ orderDetails: products });
    this.orderDetails = products;
  }
  getPurchaseOrderProducts(purchaseOrderId: number) {
    this.showLoader = true;
    this.purchaseService.GetPurchaseOrderProducts_Data(purchaseOrderId).subscribe((data: GeneralOrderDetailsModel[]) => {
      if (data) {
        this.orderDetails = [];
        this.clearAllProducts = !this.clearAllProducts;
        this.orderDetails = data.map(product => ({
          ...product,
          requestedQuantity: product.quantity,
        }));
        // this.formGroup.patchValue({orderDetails:this.orderDetails});
        this.formGroup.patchValue({ purchaseOrderId: purchaseOrderId });
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  initNewForm(orderModel: MaterialReceiptModel = null) {
    this.orderDetails = [];
    this.clearAllProducts = !this.clearAllProducts;
    this.isUpdate = false;
    this.buildForm();
    if (orderModel)
      this.fillEditForm(orderModel);
  }

  buildForm() {
    this.formGroup = this.form.group({
      materialReceiptId: [null],
      orderNumber: [null],
      docNumber: [null],
      orderDate: [{ value: this.today, disabled: true }, [Validators.required]],
      supplierId: [null, [Validators.required]],
      purchaseOrderId: [null, [Validators.required]],
      storeId: [null, [Validators.required]],
      orderDetails: [[] as GeneralOrderDetailsModel[], [Validators.required, Validators.minLength(1)]],
      notes: [null],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
  }


  saveMaterialReceipt() {
    if (this.orderDetails.length === 0)
      this.toaster.warning('لا يوجد اصناف');

    if (!this.validateForm()) {
      return;
    }
    this.materialReceiptModel = this.formGroup.value;

    if (this.materialReceiptId)
      this.editMaterialReceipt();
    else
      this.addNewMaterialReceipt();
  }

  addNewMaterialReceipt() {
    this.showAddLoader = true;
    this.inventoryService.AddNewMaterialReceipt(this.materialReceiptModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        // this.formGroup?.reset();
        this.initNewForm();
        this.toaster.success(data?.message);
        if (data.id) {
          this.materialReceiptId = data.id;
          this.goToPage(this.materialReceiptId);
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

  editMaterialReceipt() {
    this.showAddLoader = true;
    this.inventoryService.EditMaterialReceipt(this.materialReceiptId, this.materialReceiptModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.initNewForm();
        this.toaster.success(data?.message);
        this.getMaterialReceiptDetailsById();
        this.getMaterialReceiptProducts();
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
    this.sharedService.GetStoresSelector().subscribe((data: FormDropdownModel[]) => {
      this.inventoriesSelectorData = data;
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

  fillEditForm(orderModel: MaterialReceiptModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      materialReceiptId: orderModel.materialReceiptId,
      orderNumber: orderModel.orderNumber,
      docNumber: orderModel.docNumber,
      orderDate: this.datePipe.transform(orderModel.orderDate, 'yyyy-MM-dd'),
      supplierId: orderModel.supplierId,
      purchaseOrderId: orderModel.purchaseOrderId,
      storeId: orderModel.storeId,
      notes: orderModel.notes

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
        queryParams: { MaterialReceiptId: id },
        queryParamsHandling: 'merge'
      });
    }
  }

  public formErrors = {
    supplierId: '',
    materialReceiptId: '',
    orderNumber: '',
    docNumber: '',
    orderDate: '',
    purchaseOrderId: '',
    storeId: '',
    orderDetails: '',
    notes: ''
  };


}