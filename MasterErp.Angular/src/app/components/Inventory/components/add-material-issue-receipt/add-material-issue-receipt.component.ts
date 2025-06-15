import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { InventoryService } from '../../services/inventory.service';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { OrderDetailModel } from 'src/app/components/Shared/models/ItemModel';
import { MaterialIssueModel } from '../../models/MaterialIssueModel';
import { GeneralOrderDetailsModel } from '../../models/GeneralOrderModel ';

@Component({
  selector: 'app-add-material-issue-receipt',
  templateUrl: './add-material-issue-receipt.component.html',
  styleUrls: ['./add-material-issue-receipt.component.css']
})

export class AddMaterialIssueReceiptComponent implements OnInit {
  TitleList = ['المخازن', 'إنشاء إذن صرف مواد'];
  materialIssueId: number;
  materialIssueModel: MaterialIssueModel = {} as MaterialIssueModel;
  orderDetails: GeneralOrderDetailsModel[] = [];

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
    serialNumber: '',
    docNumber: '',
    materialIssueId: '',
    orderDate: '',
    storeId: '',
    orderDetails: '',
    notes: ''
  };

  today: string;
  constructor(private acRoute: ActivatedRoute, private router: Router,
    private modalService: NgbModal,
    private inventoryService: InventoryService,
    private purchaseService: PurchaseService,
    private sharedService: SharedService,
    private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe,
    private toaster: ToastrService,
    private offcanvasService: NgbOffcanvas,) {
    this.today = this.datePipe.transform(new Date, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.MaterialIssueId) {
        this.materialIssueId = params.MaterialIssueId;
        this.getMaterialIssueDetailsById();
        this.getMaterialIssueProducts();
      }
    })

    this.initNewForm();
    this.loadSelectors();
  }

  getMaterialIssueDetailsById() {
    this.showLoader = true;
    this.inventoryService.GetMaterialIssueDetailsById(this.materialIssueId).subscribe((data: MaterialIssueModel) => {
      if (data) {
        this.materialIssueModel = data;
        this.fillEditForm(this.materialIssueModel)
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

  initNewForm(materialIssueModel: MaterialIssueModel = null) {
    this.orderDetails = [];
    this.clearAllProducts = !this.clearAllProducts;
    this.isUpdate = false;
    this.buildForm();
    if (materialIssueModel)
      this.fillEditForm(materialIssueModel);
  }

  buildForm() {
    this.formGroup = this.form.group({
      materialIssueId: [null],
      orderNumber: [null],
      serialNumber: [null],
      docNumber: [null],
      branchId: [null, [Validators.required]],
      orderDate: [{ value: this.today, disabled: true }, [Validators.required]],
      storeId: [null, [Validators.required]],
      orderDetails: [[] as GeneralOrderDetailsModel[], [Validators.required, Validators.minLength(1)]],
      notes: [null],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);
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
  saveData() {
    if (this.orderDetails.length === 0)
      this.toaster.warning('لا يوجد اصناف');

    if (!this.validateForm()) {
      return;
    }

    this.materialIssueModel = this.formGroup.value;

    if (this.materialIssueId)
      this.editMaterialIssue();
    else
      this.addNewMaterialIssue();
  }

  addNewMaterialIssue() {
    this.showAddLoader = true;
    this.inventoryService.AddNewMaterialIssue(this.materialIssueModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        // this.formGroup?.reset();
        this.initNewForm();
        if (data.id) {
          this.materialIssueId = data.id;
          this.goToPage(this.materialIssueId);

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
    this.inventoryService.EditMaterialIssue(this.materialIssueId, this.materialIssueModel).subscribe((data: ActionsResponseModel) => {
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

  fillEditForm(materialIssueModel: MaterialIssueModel) {
    this.isUpdate = true;
    this.formGroup.patchValue({
      materialIssueId: materialIssueModel.materialIssueId,
      orderNumber: materialIssueModel.orderNumber,
      serialNumber: materialIssueModel.serialNumber,
      docNumber: materialIssueModel.docNumber,
      branchId: materialIssueModel.branchId,
      storeId: materialIssueModel.storeId,
      notes: materialIssueModel.notes,
      orderDate: this.datePipe.transform(materialIssueModel.orderDate, 'yyyy-MM-dd'),
    });
  }
  goToPage(id: number) {
    if (id) {
      this.router.navigate([], {
        relativeTo: this.acRoute,
        queryParams: { MaterialIssueId: id },
        queryParamsHandling: 'merge'
      });
    }
  }
}