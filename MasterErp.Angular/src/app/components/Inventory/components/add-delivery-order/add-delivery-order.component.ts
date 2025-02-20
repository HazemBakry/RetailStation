import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from '../../services/inventory.service';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { OrderModel, OrderProductModel } from '../../models/inventory';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { DatePipe } from '@angular/common';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';

@Component({
  selector: 'app-add-delivery-order',
  templateUrl: './add-delivery-order.component.html',
  styleUrls: ['./add-delivery-order.component.css']
})

export class AddDeliveryOrderComponent implements OnInit {
  TitleList = ['المخازن', 'إضافة إذن جديد'];
  deliveryOrderId:number;
  deliveryOrderModel: OrderModel = {} as OrderModel;
  orderProducts : OrderProductModel[]=[];
  isUpdate: boolean = false;
  clearAllProducts: boolean = false;

  branchesSelectorData: FormDropdownModel[] = [];
  inventoriesSelectorData: FormDropdownModel[] = [];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  supplierImageFile: File;
  formData: FormData = new FormData();
  public formGroup: FormGroup;


  constructor(private acRoute: ActivatedRoute, private router: Router, private modalService: NgbModal, private inventoryService: InventoryService,
    private purchaseService: PurchaseService, private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }


  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.DeliveryOrderId) {
        this.deliveryOrderId = params.DeliveryOrderId;
        this.getDeliveryOrderDetailsById();
        this.getDeliveryOrderProducts();
      }
    })


    this.initNewForm();
    
    this.loadSelectors();
  }

  getDeliveryOrderDetailsById() {
    this.showLoader = true;
    this.inventoryService.GetDeliveryOrderDetailsById(this.deliveryOrderId).subscribe((data: OrderModel) => {
      if (data) {
        this.deliveryOrderModel = data;
        // this.getDeliveryOrderProducts();
        // this.initNewForm(this.deliveryOrderModel);
        this.fillEditForm(this.deliveryOrderModel)
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  getDeliveryOrderProducts() {
    this.showLoader = true;
    this.inventoryService.GetDeliveryOrderProducts_Data(this.deliveryOrderId).subscribe((data: OrderProductModel[]) => {
      this.orderProducts = data;
      if (this.orderProducts.length>0) {
        // this.formGroup.patchValue({orderProducts:this.orderProducts});
      }
      // this.initNewForm(this.deliveryOrderModel);
    
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  getSelectedProductsList(products:OrderProductModel[]) {
    this.formGroup.patchValue({orderProducts:products});
    this.orderProducts = products;
  }

  initNewForm(orderModel: OrderModel = null) {
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
      branchId: [null, [Validators.required]],
      orderDate: [null, [Validators.required]],
      storeId: [null, [Validators.required]],
      orderProducts: [[] as OrderProductModel[], [Validators.required,Validators.minLength(1)]],
      notes: [null],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
  }


  saveDeliveryOrder() {
    if(this.orderProducts.length === 0) 
      this.toaster.warning('لا يوجد اصناف');
    
    if (!this.validateForm()) {
      return;
    }
    this.deliveryOrderModel = this.formGroup.value;

    if (this.deliveryOrderId)
      this.editDeliveryOrder();
    else
      this.addNewDeliveryOrder();
  }

  addNewDeliveryOrder() {
    this.showAddLoader = true;
    this.inventoryService.AddNewDeliveryOrder(this.deliveryOrderModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        // this.formGroup?.reset();
        this.initNewForm();
        if(data.id)
        {
          this.deliveryOrderId=data.id;
          this.getDeliveryOrderDetailsById();
          this.getDeliveryOrderProducts();

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

  editDeliveryOrder() {
    this.showAddLoader = true;
    this.inventoryService.EditDeliveryOrder(this.deliveryOrderId, this.deliveryOrderModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.initNewForm();
        this.toaster.success(data?.message);
        this.getDeliveryOrderDetailsById();
        this.getDeliveryOrderProducts();
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
      branchId: orderModel.branchId,
      storeId: orderModel.storeId,
      notes:orderModel.notes,  
      orderDate:this.datePipe.transform(orderModel.orderDate, 'yyyy-MM-dd'),
    
      
    });
  }

  public formErrors = {
    branchId: '',
    orderId: '',
    orderDate: '',
    storeId: '',
    orderProducts: '',
    notes: ''
  };
  

}