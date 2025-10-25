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
import { ActionsResponseModel } from 'src/app/components/Shared/models/ActionsResponseModel';
import { InventoryService } from 'src/app/components/Inventory/services/inventory.service';
import { MaterialRequestModel } from 'src/app/components/Inventory/models/MaterialRequestModel ';
import { GeneralOrderDetailsModel } from 'src/app/components/Inventory/models/GeneralOrderModel ';
import { PurchaseOrderModel } from '../../models/PurchaseOrder';
import { GeneralSelectorModel } from 'src/app/components/Shared/components/general-selector/general-selector.component';
import { ItemModel } from 'src/app/components/Shared/models/ItemModel';

@Component({
  selector: 'app-add-purchase-order',
  templateUrl: './add-purchase-order.component.html',
  styleUrls: ['./add-purchase-order.component.css']
})

export class AddPurchaseOrderComponent implements OnInit {
  TitleList = ['المشتريات', 'إنشاء امر شراء'];

  purchaseOrderId: number;
  purchaseOrderModel: PurchaseOrderModel = {} as PurchaseOrderModel;
  orderDetails: GeneralOrderDetailsModel[] = [];
  isUpdate: boolean = false;
  clearAllProducts: boolean = false;

  suppliersSelectorData: GeneralSelectorModel[] = [];
  branchesSelectorData: GeneralSelectorModel[] = [];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  supplierImageFile: File;
  formData: FormData = new FormData();
  public formGroup: FormGroup;

  selectedSupplierId: number;
  constructor(private acRoute: ActivatedRoute, private router: Router, private modalService: NgbModal, private inventoryService: InventoryService,
    private purchaseService: PurchaseService, private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }


  ngOnInit(): void {
    this.loadSelectors();
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.PurchaseOrderId) {
        this.initNewForm();
        this.purchaseOrderId = params.PurchaseOrderId;
        this.getPurchaseOrderDetailsById();
        this.getPurchaseOrderProducts();
      }
      else if (params.MaterialRequestId) {
       this.getMaterialRequestProducts([params.MaterialRequestId]);
      }
    })
    this.initNewForm();
  }

  getPurchaseOrderDetailsById() {
    this.showLoader = true;
    this.purchaseService.GetPurchaseOrderDetailsById(this.purchaseOrderId).subscribe((data: PurchaseOrderModel) => {
      if (data) {
        this.purchaseOrderModel = data;
        // this.getPurchaseOrderProducts();
        // this.initNewForm(this.purchaseOrderModel);
        this.fillEditForm(this.purchaseOrderModel);

      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }


  getPurchaseOrderProducts() {
    this.showLoader = true;
    this.purchaseService.GetPurchaseOrderProducts_Data(this.purchaseOrderId).subscribe((data: GeneralOrderDetailsModel[]) => {
      this.orderDetails = data;
      if (this.orderDetails.length > 0) {
        // this.formGroup.patchValue({orderDetails:this.orderDetails});
      }
      // this.initNewForm(this.purchaseOrderModel);

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


  initNewForm(orderModel: PurchaseOrderModel = null) {
    this.purchaseOrderModel = {} as PurchaseOrderModel;
    this.orderDetails = [];
    this.clearAllProducts = !this.clearAllProducts;
    this.isUpdate = false;
    this.buildForm();
    if (orderModel)
      this.fillEditForm(orderModel);
  }

  buildForm() {
    this.formGroup = this.form.group({
      purchaseOrderId: [null],
      orderNumber: [null],
      orderDate: [null],
      docNumber: [null],
      supplierId: [null, [Validators.required]],
      materialRequestIds: [null],
      // branchId: [null, [Validators.required]],
      orderDetails: [[] as GeneralOrderDetailsModel[], [Validators.required, Validators.minLength(1)]],
      notes: [null],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
  }


  savePurchaseOrder() {
    if (this.orderDetails.length === 0)
      this.toaster.warning('لا يوجد اصناف');

    if (!this.validateForm()) {
      return;
    }
    this.purchaseOrderModel = this.formGroup.value;

    if (this.purchaseOrderId)
      this.editPurchaseOrder();
    else
      this.addNewPurchaseOrder();
  }

  addNewPurchaseOrder() {
    this.showAddLoader = true;
    this.purchaseService.AddNewPurchaseOrder(this.purchaseOrderModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        // this.formGroup?.reset();
        this.initNewForm();
        this.toaster.success(data?.message);
        if (data.id) {
          this.purchaseOrderId = data.id;
          this.goToPage(this.purchaseOrderId);
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

  editPurchaseOrder() {
    this.showAddLoader = true;
    this.purchaseService.EditPurchaseOrder(this.purchaseOrderId, this.purchaseOrderModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.initNewForm();
        this.toaster.success(data?.message);
        this.getPurchaseOrderDetailsById();
        this.getPurchaseOrderProducts();
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
    this.sharedService.GetSuppliersSelector().subscribe((data: GeneralSelectorModel[]) => {
      this.suppliersSelectorData = data;
    });
    this.sharedService.GetBranchesSelector().subscribe((data: GeneralSelectorModel[]) => {
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

  fillEditForm(orderModel: PurchaseOrderModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      purchaseOrderId: orderModel.purchaseOrderId,
      supplierId: orderModel.supplierId,
      orderNumber: orderModel.orderNumber,
      docNumber: orderModel.docNumber,
      orderDate: this.datePipe.transform(orderModel.orderDate, 'yyyy-MM-dd'),
      // materialRequestIds: orderModel.materialRequestIds,
      // branchId: orderModel.branchId,
      notes: orderModel.notes

    });
  }
  getSelectedSupplier(supplierId) {
    this.selectedSupplierId = supplierId;
  }
  getSupplierItemsBySupplierId() {
    this.orderDetails =[];
    if(!this.selectedSupplierId)
    {
      this.toaster.warning('please select supplier');
      return;
    }
    this.inventoryService.GetItemsBySupplierId(this.selectedSupplierId).subscribe(data => {
      if (data && data.length > 0) {
        this.orderDetails = this.mapItemToOrderProduct(data);
      }
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  searchMaterialRequestSelected(materialRequests: MaterialRequestModel[]) {
    if (materialRequests?.length) {
      var ids = materialRequests.map(b => b.materialRequestId);
      this.getMaterialRequestProducts(ids)
    }
    else
    {
      this.orderDetails = []
    }
  }

  getMaterialRequestProducts(materialRequestIds:number[]) {
    this.showLoader = true;
    this.inventoryService.GetMaterialRequestProducts_Data(materialRequestIds).subscribe((data: GeneralOrderDetailsModel[]) => {
      this.orderDetails = data.map(product => ({
        ...product,
        requestedQuantity: product.quantity,
      }));

      if (this.orderDetails.length > 0) {
        this.formGroup.patchValue({materialRequestIds:materialRequestIds});
      }
      // this.initNewForm(this.purchaseOrderModel);

      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
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
  goToPage(id: number) {
    if (id) {
      this.router.navigate([], {
        relativeTo: this.acRoute,
        queryParams: { PurchaseOrderId:id },
        queryParamsHandling: 'merge'
      });
    }
  }
  mapItemToOrderProduct(arrayOfItems: ItemModel[]): GeneralOrderDetailsModel[] {
    return arrayOfItems.map(x => this.mapSingleItemToOrderProduct(x));
  }
  private mapSingleItemToOrderProduct(x: ItemModel): GeneralOrderDetailsModel {
    return {
      itemId: x.itemId,
      itemNameAR: x.nameAR,
      itemNameEN: x.nameEN,
      // isActive: x.isActive,
      unitNameAR: x.unitName,
      unitNameEN: x.unitName,
      unitId: x.unitId,
      price:x.cost,
      quantity : 0,
      totalValue :0
    };
  }
  public formErrors = {
    supplierId: '',
    purchaseOrderId: '',
    orderNumber: '',
    docNumber: '',
    materialRequestIds: '',
    branchId: '',
    orderDate: '',
    orderDetails: '',
    notes: ''
  };


}