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

@Component({
  selector: 'app-add-purchases-request',
  templateUrl: './add-purchases-request.component.html',
  styleUrls: ['./add-purchases-request.component.css']
})

export class AddPurchasesRequestComponent implements OnInit {
  TitleList = ['المخازن', 'إضافة طلب شراء'];
  purchaseRequestId: number;
  purchaseRequestModel: OrderModel = {} as OrderModel;
  orderProducts: OrderProductModel[] = [];
  isUpdate: boolean = false;
  clearAllProducts: boolean = false;

  branchesSelectorData: FormDropdownModel[] = [];
  inventoriesSelectorData: FormDropdownModel[] = [];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  supplierImageFile: File;
  formData: FormData = new FormData();
  public formGroup: FormGroup;


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
        this.purchaseRequestModel = data;
        this.fillEditForm(this.purchaseRequestModel)
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


  savePurchaseRequest() {
    if (this.orderProducts.length === 0)
      this.toaster.warning('لا يوجد اصناف');

    if (!this.validateForm()) {
      return;
    }
    this.purchaseRequestModel = this.formGroup.value;

    if (this.purchaseRequestId)
      this.editPurchaseRequest();
    else
      this.addNewPurchaseRequest();
  }

  addNewPurchaseRequest() {
    this.showAddLoader = true;
    this.inventoryService.AddNewDeliveryNote(this.purchaseRequestModel).subscribe((data: ActionsResponseModel) => {
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
    this.inventoryService.EditPurchasesRequest(this.purchaseRequestId, this.purchaseRequestModel).subscribe((data: ActionsResponseModel) => {
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
      this.branchesSelectorData = data;
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

  public formErrors = {
    branchId: '',
    orderId: '',
    orderDate: '',
    storeId: '',
    orderProducts: '',
    description: ''
  };
}