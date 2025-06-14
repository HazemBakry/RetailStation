
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseService } from 'src/app/components/Purchases/services/purchase.service';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from 'src/app/components/Shared/services/form.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/components/Shared/services/shared.service';
import { DatePipe } from '@angular/common';
import { FormDropdownModel } from 'src/app/components/Shared/components/drop-down-form-control/drop-down-form-control.component';
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { InventoryService } from 'src/app/components/Inventory/services/inventory.service';
import { GeneralOrderDetailsModel } from 'src/app/components/Inventory/models/GeneralOrderModel ';
import { PurchaseReturnsModel } from '../../models/PurchaseReturns';
import { PurchaseInvoiceModel } from '../../models/PurchaseInvoiceModel';

@Component({
  selector: 'app-add-purchase-returns',
  templateUrl: './add-purchase-returns.component.html',
  styleUrls: ['./add-purchase-returns.component.css']
})

export class AddPurchaseReturnsComponent implements OnInit {
    TitleList = ['المشتريات', 'إنشاء فاتورة مرتجعات'];

  purchaseReturnsId: number;
  purchaseReturnsModel: PurchaseReturnsModel = {} as PurchaseReturnsModel;
  orderDetails: GeneralOrderDetailsModel[] = [];
  isUpdate: boolean = false;
  clearAllProducts: boolean = false;

  suppliersSelectorData: FormDropdownModel[] = [];
  branchesSelectorData: FormDropdownModel[] = [];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  supplierImageFile: File;
  formData: FormData = new FormData();
  public formGroup: FormGroup;

  selectedPurchaseInvoice: PurchaseInvoiceModel;
  selectedSupplierId: number;
  constructor(private acRoute: ActivatedRoute, private router: Router, private modalService: NgbModal, private inventoryService: InventoryService,
    private purchaseService: PurchaseService, private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }


  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.PurchaseReturnsId) {
        this.purchaseReturnsId = params.PurchaseReturnsId;
        this.getPurchaseReturnsDetailsById();
        this.getPurchaseReturnsProducts();
      }
    })


    this.initNewForm();

    this.loadSelectors();
  }

  getPurchaseReturnsDetailsById() {
    this.showLoader = true;
    this.purchaseService.GetPurchaseReturnsDetailsById(this.purchaseReturnsId).subscribe((data: PurchaseReturnsModel) => {
      if (data) {
        this.purchaseReturnsModel = data;
        // this.getPurchaseReturnsProducts();
        // this.initNewForm(this.purchaseReturnsModel);
        this.fillEditForm(this.purchaseReturnsModel);
        if (data.purchaseInvoiceId) {
          this.getPurchaseInvoiceDetailsById(data.purchaseInvoiceId);
        }
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  getPurchaseInvoiceDetailsById(invoiceId: number) {
    this.showLoader = true;
    this.purchaseService.GetPurchaseInvoiceDetailsById(invoiceId).subscribe((data: PurchaseInvoiceModel) => {
      if (data) {
        this.selectedPurchaseInvoice = data;
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  getPurchaseReturnsProducts() {
    this.showLoader = true;
    this.purchaseService.GetPurchaseReturnsProducts_Data(this.purchaseReturnsId).subscribe((data: GeneralOrderDetailsModel[]) => {
      this.orderDetails = data;
      if (this.orderDetails.length > 0) {
        // this.formGroup.patchValue({orderDetails:this.orderDetails});
      }
      // this.initNewForm(this.purchaseReturnsModel);

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }
  searchInvoiceSelected(inv: PurchaseInvoiceModel) {
    this.selectedPurchaseInvoice = inv;
    this.getPurchaseInvoiceProducts();
  }
  getSelectedProductsList(products: GeneralOrderDetailsModel[]) {
    this.formGroup.patchValue({ orderDetails: products });
    this.orderDetails = products;
  }
  getPurchaseInvoiceProducts() {
    this.showLoader = true;
    this.purchaseService.GetPurchaseInvoiceProducts_Data(this.selectedPurchaseInvoice.purchaseInvoiceId).subscribe((data: GeneralOrderDetailsModel[]) => {
      if (data) {
        this.orderDetails = data;
        // this.formGroup.patchValue({orderDetails:this.orderDetails});
        this.formGroup.patchValue({ purchaseInvoiceId: this.selectedPurchaseInvoice.purchaseInvoiceId });

      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  initNewForm(orderModel: PurchaseReturnsModel = null) {
    this.selectedPurchaseInvoice = {} as PurchaseInvoiceModel;
    this.orderDetails = [];
    this.clearAllProducts = !this.clearAllProducts;
    this.isUpdate = false;
    this.buildForm();
    if (orderModel)
      this.fillEditForm(orderModel);
  }

  buildForm() {
    this.formGroup = this.form.group({
      purchaseReturnsId: [null],
      serialNumber: [null],
      docNumber: [null],
      // supplierId: [null, [Validators.required]],
      purchaseInvoiceId: [null, [Validators.required]],
      // branchId: [null, [Validators.required]],
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
  savePurchaseReturns() {
    if (this.orderDetails.length === 0)
      this.toaster.warning('لا يوجد اصناف');

    if (!this.validateForm()) {
      return;
    }
    this.purchaseReturnsModel = this.formGroup.value;

    if (this.purchaseReturnsId)
      this.editPurchaseReturns();
    else
      this.addNewPurchaseReturns();
  }

  addNewPurchaseReturns() {
    this.showAddLoader = true;
    this.purchaseService.AddNewPurchaseReturns(this.purchaseReturnsModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        // this.formGroup?.reset();
        this.initNewForm();
        this.toaster.success(data?.message);
        if (data.id) {
          this.purchaseReturnsId = data.id;
          this.goToPage(this.purchaseReturnsId);
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

  editPurchaseReturns() {
    this.showAddLoader = true;
    this.purchaseService.EditPurchaseReturns(this.purchaseReturnsId, this.purchaseReturnsModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.initNewForm();
        this.toaster.success(data?.message);
        this.getPurchaseReturnsDetailsById();
        this.getPurchaseReturnsProducts();
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
    this.sharedService.GetBranchesSelector().subscribe((data: FormDropdownModel[]) => {
      this.branchesSelectorData = data;
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

  fillEditForm(orderModel: PurchaseReturnsModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      purchaseReturnsId: orderModel.purchaseReturnsId,
      serialNumber: orderModel.serialNumber,
      docNumber: orderModel.docNumber,
      // supplierId: orderModel.supplierId,
      // orderDate:this.datePipe.transform(orderModel.orderDate, 'yyyy-MM-dd'),
      purchaseInvoiceId: orderModel.purchaseInvoiceId,
      // branchId: orderModel.branchId,
      notes: orderModel.notes

    });
  }
    goToPage(id: number) {
    if (id) {
      this.router.navigate([], {
        relativeTo: this.acRoute,
        queryParams: { PurchaseReturnsId: id },
        queryParamsHandling: 'merge'
      });
    }
  }
  getSelectedSupplier(supplierId) {
    this.selectedSupplierId = supplierId;
  }
  public formErrors = {
    serialNumber: '',
    purchaseReturnsId: '',
    docNumber: '',
    purchaseInvoiceId: '',
    branchId: '',
    orderDate: '',
    orderDetails: '',
    notes: ''
  };


}