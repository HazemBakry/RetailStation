import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from '../../services/inventory.service';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { OrderModel, OrderProductModel } from '../../models/inventory';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { DatePipe } from '@angular/common';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { ActionsResponseModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';

@Component({
  selector: 'app-add-receive-order',
  templateUrl: './add-receive-order.component.html',
  styleUrls: ['./add-receive-order.component.css']
})

export class AddReceiveOrderComponent implements OnInit {
  receiveOrderId:number;
  receiveOrderModel: OrderModel = {} as OrderModel;
  orderProducts : OrderProductModel[]=[];
  isUpdate: boolean = false;
  clearAllProducts: boolean = false;

  suppliersSelectorData: FormDropdownModel[] = [];
  inventoriesSelectorData: FormDropdownModel[] = [];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  supplierImageFile: File;
  formData: FormData = new FormData();
  public formGroup: FormGroup;

  selectedPurchaseOrder: OrderModel = {} as OrderModel;

  constructor(private acRoute: ActivatedRoute, private router: Router, private modalService: NgbModal, private inventoryService: InventoryService,
    private purchaseService: PurchaseService, private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }


  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.ReceiveOrderId) {
        this.receiveOrderId = params.ReceiveOrderId;
        this.getReceiveOrderDetailsById();
        this.getReceiveOrderProducts();
      }
    })


    this.initNewForm();
    
    this.loadSelectors();
  }

  getReceiveOrderDetailsById() {
    this.showLoader = true;
    this.inventoryService.GetReceiveOrderDetailsById(this.receiveOrderId).subscribe((data: OrderModel) => {
      if (data) {
        this.receiveOrderModel = data;
        // this.getReceiveOrderProducts();
        // this.initNewForm(this.receiveOrderModel);
        this.fillEditForm(this.receiveOrderModel)
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  getReceiveOrderProducts() {
    this.showLoader = true;
    this.inventoryService.GetReceiveOrderProducts_Data([this.receiveOrderId]).subscribe((data: OrderProductModel[]) => {
      this.orderProducts = data;
      if (this.orderProducts.length>0) {
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
  searchOrderSelected(ord:OrderModel) {
    this.selectedPurchaseOrder = ord;
    this.getPurchaseOrderProducts();
  }
  getSelectedProductsList(products:OrderProductModel[]) {
    this.formGroup.patchValue({orderProducts:products});
    this.orderProducts = products;
  }
  getPurchaseOrderProducts() {
    this.showLoader = true;
    this.purchaseService.GetPurchaseOrderProducts_Data(this.selectedPurchaseOrder.purchaseOrderId).subscribe((data: OrderProductModel[]) => {
      if (data) {
        this.orderProducts = data;
        // this.formGroup.patchValue({orderProducts:this.orderProducts});
        this.formGroup.patchValue({purchaseOrderId:this.selectedPurchaseOrder.purchaseOrderId});

      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  initNewForm(orderModel: OrderModel = null) {
    this.selectedPurchaseOrder = {} as OrderModel;
    this.orderProducts=[];
    this.clearAllProducts=!this.clearAllProducts;
    this.isUpdate = false;
    this.buildForm();
    if (orderModel)
      this.fillEditForm(orderModel);
  }

  buildForm() {
    this.formGroup = this.form.group({
      orderId: [null],
      supplierId: [null, [Validators.required]],
      purchaseOrderId: [null, [Validators.required]],
      storeId: [null, [Validators.required]],
      orderProducts: [[] as OrderProductModel[], [Validators.required,Validators.minLength(1)]],
      notes: [null],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
  }


  saveReceiveOrder() {
    if(this.orderProducts.length === 0) 
      this.toaster.warning('لا يوجد اصناف');
    
    if (!this.validateForm()) {
      return;
    }
    this.receiveOrderModel = this.formGroup.value;

    if (this.receiveOrderId)
      this.editReceiveOrder();
    else
      this.addNewReceiveOrder();
  }

  addNewReceiveOrder() {
    this.showAddLoader = true;
    this.inventoryService.AddNewReceiveOrder(this.receiveOrderModel).subscribe((data: ActionsResponseModel) => {
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

  editReceiveOrder() {
    this.showAddLoader = true;
    this.inventoryService.EditReceiveOrder(this.receiveOrderId, this.receiveOrderModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.initNewForm();
        this.toaster.success(data?.message);
        this.getReceiveOrderDetailsById();
        this.getReceiveOrderProducts();
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
    this.sharedService.GetInventoriesSelector().subscribe((data: FormDropdownModel[]) => {
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
      supplierId: orderModel.supplierId,
      purchaseOrderId: orderModel.purchaseOrderId,
      storeId: orderModel.storeId,
      notes:orderModel.notes
      
    });
  }

  public formErrors = {
    supplierId: '',
    orderId: '',
    purchaseOrderId: '',
    storeId: '',
    orderProducts: '',
    notes: ''
  };
  

}