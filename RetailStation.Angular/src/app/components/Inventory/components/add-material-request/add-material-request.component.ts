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
import { LookupService } from 'src/app/components/Shared/services/lookup.service';

@Component({
  selector: 'app-add-material-request',
  templateUrl: './add-material-request.component.html',
  styleUrls: ['./add-material-request.component.css']
})

export class AddMaterialRequestComponent implements OnInit {
  TitleList = ['المخازن', 'إنشاء طلب شراء'];
  materialRequestId: number;
  materialRequestModel: MaterialRequestModel = {} as MaterialRequestModel;
  orderDetails: GeneralOrderDetailsModel[] = [];
  isUpdate: boolean = false;
  clearAllProducts: boolean = false;

  storesSelectorData: GeneralSelectorModel[] = [];
  orderStatusSelectorData: GeneralSelectorModel[] = [];
  materialRequestPurposesSelectorData: GeneralSelectorModel[] = [];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  supplierImageFile: File;
  formData: FormData = new FormData();
  public formGroup: FormGroup;

  today: string;
  constructor(private acRoute: ActivatedRoute, private router: Router,
    private modalService: NgbModal,
    private inventoryService: InventoryService,
    private sharedService: SharedService,
    private lookupService: LookupService,
    private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe,
    private toaster: ToastrService,
    private offcanvasService: NgbOffcanvas,) {
    this.today = this.datePipe.transform(new Date, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.loadSelectors();
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.MaterialRequestId) {
        this.materialRequestId = params.MaterialRequestId;
        this.initNewForm();
        this.getMaterialRequestDetailsById();
        this.getMaterialRequestProducts();
      }
    });
    this.initNewForm();

  }
  goToMaterialRequest(id: number) {
    if (id) {
      this.router.navigate([], {
        relativeTo: this.acRoute,
        queryParams: { MaterialRequestId: id },
        queryParamsHandling: 'merge'
      });
    }
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
      data.forEach((item: GeneralOrderDetailsModel) => {
        item.dueDate = this.datePipe.transform(item.dueDate, 'yyyy-MM-dd');
      });

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
      storeId: [null, [Validators.required]],
      orderDate: [{ value: this.today, disabled: true }, , [Validators.required]],
      dueDate: [null, [Validators.required]],
      purposeId: [null],
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
        this.toaster.success(data?.message);
        if (data.id) {
          this.materialRequestId = data.id;
          // this.getMaterialRequestDetailsById();
          // this.getMaterialRequestProducts();
          this.goToMaterialRequest(this.materialRequestId);
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
    this.sharedService.GetStoresSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.storesSelectorData = data;
    });
    this.sharedService.GetOrderStatusSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.orderStatusSelectorData = data;
    });
    this.lookupService.GetMaterialRequestPurposesSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.materialRequestPurposesSelectorData = data;
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
      storeId: orderModel.storeId,
      docNumber: orderModel.docNumber,
      dueDate: this.datePipe.transform(orderModel.dueDate, 'yyyy-MM-dd'),
      purposeId: orderModel.purposeId,
      statusId: orderModel.statusId,
      notes: orderModel.notes,
      orderDate: this.datePipe.transform(orderModel.orderDate, 'yyyy-MM-dd'),
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

  public formErrors = {
    orderNumber: '',
    storeId: '',
    docNumber: '',
    orderId: '',
    orderDate: '',
    dueDate: '',
    purposeId: '',
    statusId: '',
    orderDetails: '',
    notes: ''
  };
}