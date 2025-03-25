import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from '../../services/inventory.service';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { OrderModel } from '../../models/inventory';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { DatePipe } from '@angular/common';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { GeneralOrderDetailsModel } from '../../models/GeneralOrderModel ';

@Component({
  selector: 'app-add-delivery-note',
  templateUrl: './add-delivery-note.component.html',
  styleUrls: ['./add-delivery-note.component.css']
})

export class AddDeliveryNoteComponent implements OnInit {
  TitleList = ['المخازن', 'إضافة إذن صرف'];
  deliveryNoteId: number;
  OrderModel: OrderModel = {} as OrderModel;
  orderProducts: GeneralOrderDetailsModel[] = [];
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
      if (params.DeliveryNoteId) {
        this.deliveryNoteId = params.DeliveryNoteId;
        this.getDeliveryNoteDetailsById();
        this.getDeliveryNoteProducts();
      }
    })

    this.initNewForm();

    this.loadSelectors();
  }

  getDeliveryNoteDetailsById() {
    this.showLoader = true;
    this.inventoryService.GetDeliveryNoteDetailsById(this.deliveryNoteId).subscribe((data: OrderModel) => {
      if (data) {
        this.OrderModel = data;
        // this.getDeliveryNoteProducts();
        // this.initNewForm(this.OrderModel);
        this.fillEditForm(this.OrderModel)
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  getDeliveryNoteProducts() {
    this.showLoader = true;
    this.inventoryService.GetDeliveryNoteProducts_Data(this.deliveryNoteId).subscribe((data: GeneralOrderDetailsModel[]) => {
      this.orderProducts = data;
      if (this.orderProducts.length > 0) {
        // this.formGroup.patchValue({orderProducts:this.orderProducts});
      }
      // this.initNewForm(this.OrderModel);

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


  saveDeliveryNote() {
    if (this.orderProducts.length === 0)
      this.toaster.warning('لا يوجد اصناف');

    if (!this.validateForm()) {
      return;
    }
    this.OrderModel = this.formGroup.value;

    if (this.deliveryNoteId)
      this.editDeliveryNote();
    else
      this.addNewDeliveryNote();
  }

  addNewDeliveryNote() {
    this.showAddLoader = true;
    this.inventoryService.AddNewDeliveryNote(this.OrderModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        // this.formGroup?.reset();
        this.initNewForm();
        if (data.id) {
          this.deliveryNoteId = data.id;
          this.getDeliveryNoteDetailsById();
          this.getDeliveryNoteProducts();

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

  editDeliveryNote() {
    this.showAddLoader = true;
    this.inventoryService.EditDeliveryNote(this.deliveryNoteId, this.OrderModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.initNewForm();
        this.toaster.success(data?.message);
        this.getDeliveryNoteDetailsById();
        this.getDeliveryNoteProducts();
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
      orderDate: this.datePipe.transform(orderModel.orderDate, 'yyyy-MM-dd')
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