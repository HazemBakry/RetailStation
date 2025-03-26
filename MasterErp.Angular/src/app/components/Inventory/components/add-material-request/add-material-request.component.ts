import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { InventoryService } from '../../services/inventory.service';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { MaterialRequestModel } from '../../models/MaterialRequestModel ';
import { GeneralOrderDetailsModel } from '../../models/GeneralOrderModel ';

@Component({
  selector: 'app-add-material-request',
  templateUrl: './add-material-request.component.html',
  styleUrls: ['./add-material-request.component.css']
})

export class AddMaterialRequestComponent implements OnInit {
  TitleList = ['المخازن', 'إضافة طلب شراء'];
  materialRequestId: number;
  materialRequestModel: MaterialRequestModel = {} as MaterialRequestModel;
  orderDetails: GeneralOrderDetailsModel[] = [];
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
      if (params.MaterialRequestId) {
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
    this.inventoryService.GetMaterialRequestDetailsById(this.materialRequestId).subscribe((data: MaterialRequestModel) => {
      if (data) {
        this.materialRequestModel = data;
        this.fillEditForm(this.materialRequestModel)
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
    this.inventoryService.GetMaterialRequestProducts_Data([this.materialRequestId]).subscribe((data: GeneralOrderDetailsModel[]) => {
      this.orderDetails = data;
      if (this.orderDetails.length > 0) {
        // this.formGroup.patchValue({orderDetails:this.orderDetails});
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  getSelectedProductsList(products: GeneralOrderDetailsModel[]) {
    this.formGroup.patchValue({ orderDetails: products });
    this.orderDetails = products;
  }

  initNewForm(orderModel: MaterialRequestModel = null) {
    this.orderDetails = [];
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
      orderDetails: [[] as GeneralOrderDetailsModel[], [Validators.required, Validators.minLength(1)]],
      notes: [null],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
  }


  saveMaterialRequest() {
    if (this.orderDetails.length === 0)
      this.toaster.warning('لا يوجد اصناف');

    if (!this.validateForm()) {
      return;
    }
    this.materialRequestModel = this.formGroup.value;

    if (this.materialRequestId)
      this.editMaterialRequest();
    else
      this.addNewMaterialRequest();
  }

  addNewMaterialRequest() {
    this.showAddLoader = true;
    this.inventoryService.CreateNewMaterialRequest(this.materialRequestModel).subscribe((data: ActionsResponseModel) => {
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
    this.inventoryService.EditMaterialRequest(this.materialRequestId, this.materialRequestModel).subscribe((data: ActionsResponseModel) => {
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

  fillEditForm(orderModel: MaterialRequestModel) {
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
    orderDetails: '',
    notes: ''
  };
}