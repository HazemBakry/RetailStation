import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { InventoryService } from '../../services/inventory.service';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { OrderModel, OrderProductModel } from '../../models/inventory';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { OrderDetailModel } from 'src/app/components/Shared/models/ItemModel';

@Component({
  selector: 'app-add-material-issue-receipt',
  templateUrl: './add-material-issue-receipt.component.html',
  styleUrls: ['./add-material-issue-receipt.component.css']
})

export class AddMaterialIssueReceiptComponent implements OnInit {
  TitleList = ['المخازن', 'إضافة إذن صرف مواد'];
  purchaseRequestId: number;
  orderList: OrderModel = {} as OrderModel;
  orderProducts: OrderProductModel[] = [];
  
  isUpdate: boolean = false;
  clearAllProducts: boolean = false;

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  supplierImageFile: File;
  branchesSelector: FormDropdownModel[] = [];
  storesSelector: FormDropdownModel[] = [];
  ItemsBySupplier: OrderDetailModel[] = [];

  formData: FormData = new FormData();
  public formGroup: FormGroup;

  public formErrors = {
    branchId: '',
    orderNumber: '',
    orderId: '',
    orderDate: '',
    storeId: '',
    orderProducts: '',
    description: ''
  };


  constructor(private acRoute: ActivatedRoute, private router: Router,
    private modalService: NgbModal,
    private inventoryService: InventoryService,
    private purchaseService: PurchaseService,
    private sharedService: SharedService,
    private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe,
    private toaster: ToastrService,
    private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.OrderId) {
        this.purchaseRequestId = params.PurchaseRequestId;
        this.getPurchaseRequestDetailsById();
        this.getPurchaseRequestProducts();
      }
    })

    this.initNewForm();
    this.loadSelectors();
  }

  getPurchaseRequestDetailsById() {
    this.showLoader = true;
    this.inventoryService.GetDeliveryNoteDetailsById(this.purchaseRequestId).subscribe((data: OrderModel) => {
      if (data) {
        this.orderList = data;
        this.fillEditForm(this.orderList)
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  getPurchaseRequestProducts() {
    this.showLoader = true;
    this.inventoryService.GetPurchaseRequestProducts_Data(this.purchaseRequestId).subscribe((data: OrderProductModel[]) => {
      this.orderProducts = data;
      if (this.orderProducts.length > 0) {
        // this.formGroup.patchValue({orderProducts:this.orderProducts});
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  getSelectedProductsList(products: OrderProductModel[]) {
    this.formGroup.patchValue({ orderProducts: products });
    this.orderProducts = products;
  }

  initNewForm(orderModel: OrderModel = null) {
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
      orderNumber: [null],
      branchId: [null, [Validators.required]],
      orderDate: [null, [Validators.required]],
      storeId: [null, [Validators.required]],
      orderProducts: [[] as OrderProductModel[], [Validators.required, Validators.minLength(1)]],
      description: [null],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
  }

  addField() {
    this.orderProducts.push(
      {
        itemId: 0,
        itemNameAR: '',
        itemNameEN: '',
        unitId: 0,
        unitNameAR: '',
        unitNameEN: '',
        price: 0,
        quantity: 0,
        totalValue: 0,
        isActive: true
      }
    );
  }

  saveData() {
    if (this.orderProducts.length === 0)
      this.toaster.warning('لا يوجد اصناف');

    if (!this.validateForm()) {
      return;
    }
    this.orderList = this.formGroup.value;

    if (this.purchaseRequestId)
      this.editPurchaseRequest();
    else
      this.addNewPurchaseRequest();
  }

  addNewPurchaseRequest() {
    this.showAddLoader = true;
    this.inventoryService.AddNewDeliveryNote(this.orderList).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        // this.formGroup?.reset();
        this.initNewForm();
        if (data.id) {
          this.purchaseRequestId = data.id;
          this.getPurchaseRequestDetailsById();
          this.getPurchaseRequestProducts();

        }
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

  editPurchaseRequest() {
    this.showAddLoader = true;
    this.inventoryService.EditPurchasesRequest(this.purchaseRequestId, this.orderList).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.initNewForm();
        this.toaster.success(data?.message);
        this.getPurchaseRequestDetailsById();
        this.getPurchaseRequestProducts();
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
    this.sharedService.GetBranchesSelector().subscribe((data: FormDropdownModel[]) => {
      this.branchesSelector = data;
    });

    this.sharedService.GetStoresSelector().subscribe((data: FormDropdownModel[]) => {
      this.storesSelector = data;
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
      branchId: orderModel.branchId,
      storeId: orderModel.storeId,
      description: orderModel.description,
      orderDate: this.datePipe.transform(orderModel.orderDate, 'yyyy-MM-dd'),
    });
  }

    GetSelectedProductsList(products: OrderDetailModel[]) {
      //this.orderProducts = products;
      //this.supplierReturnsModel.items = products;
  
    }
}