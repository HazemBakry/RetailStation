import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { InventoryService } from '../../services/inventory.service';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { OrderModel, OrderProductModel } from '../../models/inventory';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';

@Component({
  selector: 'app-add-material-request',
  templateUrl: './add-material-request.component.html',
  styleUrls: ['./add-material-request.component.css']
})

export class AddMaterialRequestComponent implements OnInit {
  TitleList = ['المخازن', 'إضافة طلب شراء'];
  materialRequestId: number;
  purchaseRequestModel: OrderModel = {} as OrderModel;
  orderProducts: OrderProductModel[] = [];
  isUpdate: boolean = false;
  clearAllProducts: boolean = false;

  branchesSelectorData: GeneralSelectorModel[] = [];
  orderStatusSelectorData: GeneralSelectorModel[] = [];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  supplierImageFile: File;
  formData: FormData = new FormData();
  public formGroup: FormGroup;


  constructor(private acRoute: ActivatedRoute, private router: Router,
    private modalService: NgbModal,
    private inventoryService: InventoryService,
    private sharedService: SharedService,
    private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe,
    private toaster: ToastrService,
    private offcanvasService: NgbOffcanvas,) { }

  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.OrderId) {
        this.materialRequestId = params.MaterialRequestId;
        this.getMaterialRequestDetailsById();
        this.getMaterialRequestProducts();
      }
    })

    this.initNewForm();
    this.loadSelectors();
  }

  getMaterialRequestDetailsById() {
    this.showLoader = true;
    this.inventoryService.GetMaterialRequestDetailsById(this.materialRequestId).subscribe((data: OrderModel) => {
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

  getMaterialRequestProducts() {
    this.showLoader = true;
    this.inventoryService.GetMaterialRequestProducts_Data(this.materialRequestId).subscribe((data: OrderProductModel[]) => {
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
    console.log("🚀 ~ AddMaterialRequestComponent ~ getSelectedProductsList ~ products:", products)
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
      statusId: [null],
      orderProducts: [[] as OrderProductModel[], [Validators.required, Validators.minLength(1)]],
      notes: [null],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
  }


  saveMaterialRequest() {
    if (this.orderProducts.length === 0)
      this.toaster.warning('لا يوجد اصناف');

    if (!this.validateForm()) {
      return;
    }
    this.purchaseRequestModel = this.formGroup.value;

    if (this.materialRequestId)
      this.editMaterialRequest();
    else
      this.addNewMaterialRequest();
  }

  addNewMaterialRequest() {
    this.showAddLoader = true;
    this.inventoryService.CreateNewMaterialRequest(this.purchaseRequestModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        // this.formGroup?.reset();
        this.initNewForm();
        if (data.id) {
          this.materialRequestId = data.id;
          this.getMaterialRequestDetailsById();
          this.getMaterialRequestProducts();

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

  editMaterialRequest() {
    this.showAddLoader = true;
    this.inventoryService.EditMaterialRequest(this.materialRequestId, this.purchaseRequestModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.initNewForm();
        this.toaster.success(data?.message);
        this.getMaterialRequestDetailsById();
        this.getMaterialRequestProducts();
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
    this.sharedService.GetBranchesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.branchesSelectorData = data;
    });
    this.sharedService.GetOrderStatusSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.orderStatusSelectorData = data;
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
      branchId: orderModel.branchId,
      docNumber: orderModel.docNumber,
      statusId: orderModel.statusId,
      notes: orderModel.notes,
      orderDate: this.datePipe.transform(orderModel.orderDate, 'yyyy-MM-dd'),
    });
  }

  public formErrors = {
    orderNumber :'',
    branchId: '',
    docNumber:'',
    orderId: '',
    orderDate: '',
    statusId: '',
    orderProducts: '',
    notes: ''
  };
}