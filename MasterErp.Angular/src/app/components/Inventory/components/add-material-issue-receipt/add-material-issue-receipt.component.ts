import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { InventoryService } from '../../services/inventory.service';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { OrderModel } from '../../models/inventory';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { OrderDetailModel } from 'src/app/components/Shared/models/ItemModel';
import { GeneralOrderDetailsModel } from '../../models/GeneralOrderModel ';

@Component({
  selector: 'app-add-material-issue-receipt',
  templateUrl: './add-material-issue-receipt.component.html',
  styleUrls: ['./add-material-issue-receipt.component.css']
})

export class AddMaterialIssueReceiptComponent implements OnInit {
  TitleList = ['المخازن', 'إضافة إذن صرف مواد'];
  materialIssueId: number;
  orderModel: OrderModel = {} as OrderModel;
  orderProducts: GeneralOrderDetailsModel[] = [];
  
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
    docNumber: '',
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
        this.materialIssueId = params.OrderId;
        this.getMaterialIssueDetailsById();
        this.getMaterialIssueProducts();
      }
    })

    this.initNewForm();
    this.loadSelectors();
  }

  getMaterialIssueDetailsById() {
    this.showLoader = true;
    this.inventoryService.GetMaterialIssueDetailsById(this.materialIssueId).subscribe((data: OrderModel) => {
      if (data) {
        this.orderModel = data;
        this.fillEditForm(this.orderModel)
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  getMaterialIssueProducts() {
    this.showLoader = true;
    this.inventoryService.GetMaterialIssueProducts_Data(this.materialIssueId).subscribe((data: GeneralOrderDetailsModel[]) => {
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

  getSelectedProductsList(products: GeneralOrderDetailsModel[]) {
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
      docNumber: [null],
      branchId: [null, [Validators.required]],
      orderDate: [null, [Validators.required]],
      storeId: [null, [Validators.required]],
      orderProducts: [[] as GeneralOrderDetailsModel[], [Validators.required, Validators.minLength(1)]],
      description: [null],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
    });
  }



  saveData() {
    if (this.orderProducts.length === 0)
      this.toaster.warning('لا يوجد اصناف');

    if (!this.validateForm()) {
      return;
    }

    this.orderModel = this.formGroup.value;

    if (this.materialIssueId)
      this.editMaterialIssue();
    else
      this.addNewMaterialIssue();
  }

  addNewMaterialIssue() {
    this.showAddLoader = true;
    this.inventoryService.AddNewMaterialIssue(this.orderModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        // this.formGroup?.reset();
        this.initNewForm();
        if (data.id) {
          this.materialIssueId = data.id;
          this.getMaterialIssueDetailsById();
          this.getMaterialIssueProducts();

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

  editMaterialIssue() {
    this.showAddLoader = true;
    this.inventoryService.EditMaterialIssue(this.materialIssueId, this.orderModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.initNewForm();
        this.toaster.success(data?.message);
        this.getMaterialIssueDetailsById();
        this.getMaterialIssueProducts();
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
      orderNumber: orderModel.orderNumber,
      docNumber: orderModel.docNumber,
      branchId: orderModel.branchId,
      storeId: orderModel.storeId,
      description: orderModel.description,
      orderDate: this.datePipe.transform(orderModel.orderDate, 'yyyy-MM-dd'),
    });
  }

}