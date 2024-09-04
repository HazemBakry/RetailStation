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
import { ActionsResponseModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';
import { OrderModel, OrderProductModel } from 'src/app/components/Inventory/models/inventory';
import { InventoryService } from 'src/app/components/Inventory/services/inventory.service';
import { PurchaseQuotationDetailsModel, PurchaseQuotationModel } from '../../models/PurchaseQuotationModel';

@Component({
  selector: 'app-add-purchase-quotation',
  templateUrl: './add-purchase-quotation.component.html',
  styleUrls: ['./add-purchase-quotation.component.css']
})
export class AddPurchaseQuotationComponent implements OnInit {

  purchaseQuotationModel : PurchaseQuotationModel ={} as PurchaseQuotationModel;
  purchaseQuotationId:number;
  orderProducts : PurchaseQuotationDetailsModel[]=[];
  isUpdate: boolean = false;
  clearAllProducts: boolean = false;

  suppliersSelectorData: FormDropdownModel[] = [];
  branchesSelectorData: FormDropdownModel[] = [];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  supplierImageFile: File;
  formData: FormData = new FormData();
  public formGroup: FormGroup;

  selectedPurchaseInvoice: OrderModel = {} as OrderModel;
  selectedSupplierId: number ;
  constructor(private acRoute: ActivatedRoute, private router: Router, private modalService: NgbModal, private inventoryService: InventoryService,
    private purchaseService: PurchaseService, private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }


  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.PurchaseQuotationId) {
        this.purchaseQuotationId = params.PurchaseQuotationId;
        this.getPurchaseQuotationDetailsById();
        this.getPurchaseQuotationProducts();
      }
    })


    this.initNewForm();
    
    this.loadSelectors();
  }

  getPurchaseQuotationDetailsById() {
    this.showLoader = true;
    this.purchaseService.GetPurchaseQuotationDetailsById(this.purchaseQuotationId).subscribe((data: PurchaseQuotationModel) => {
      if (data) {
        this.purchaseQuotationModel = data;
        // this.getPurchaseQuotationProducts();
        // this.initNewForm(this.purchaseQuotationModel);
        this.fillEditForm(this.purchaseQuotationModel);

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
    this.purchaseService.GetPurchaseInvoiceDetailsById(invoiceId).subscribe((data: OrderModel) => {
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
  getPurchaseQuotationProducts() {
    this.showLoader = true;
    this.purchaseService.GetPurchaseQuotationProducts_Data(this.purchaseQuotationId).subscribe((data: PurchaseQuotationDetailsModel[]) => {
      this.orderProducts = data;
      if (this.orderProducts.length>0) {
        // this.formGroup.patchValue({orderProducts:this.orderProducts});
      }
      // this.initNewForm(this.purchaseQuotationModel);
    
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    }, () => {
      this.showLoader = false;
    });
  }

  getSelectedProductsList(products:OrderProductModel[]) {
    this.formGroup.patchValue({orderProducts:products});
  }

  initNewForm(quotationModel: PurchaseQuotationModel = null) {
    // this.selectedPurchaseInvoice = {} as PurchaseQuotationModel;
    this.orderProducts=[];
    this.clearAllProducts=!this.clearAllProducts;
    this.isUpdate = false;
    this.buildForm();
    if (quotationModel)
      this.fillEditForm(quotationModel);
  }

  buildForm() {
    this.formGroup = this.form.group({
      orderId: [null],
      supplierIds: [[], [Validators.required]],
      price: [null, [Validators.required]],
      orderProducts: [[] as OrderProductModel[], [Validators.required,Validators.minLength(1)]],
      notes: [null],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
  }


  savePurchaseQuotation() {
    if(this.orderProducts.length === 0) 
      this.toaster.warning('لا يوجد اصناف');
    
    if (!this.validateForm()) {
      return;
    }
    this.purchaseQuotationModel = this.formGroup.value;

    if (this.purchaseQuotationId)
      this.editPurchaseQuotation();
    else
      this.addNewPurchaseQuotation();
  }

  addNewPurchaseQuotation() {
    this.showAddLoader = true;
    this.purchaseService.AddNewPurchaseQuotation(this.purchaseQuotationModel).subscribe((data: ActionsResponseModel) => {
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

  editPurchaseQuotation() {
    this.showAddLoader = true;
    this.purchaseService.EditPurchaseQuotation(this.purchaseQuotationId, this.purchaseQuotationModel).subscribe((data: ActionsResponseModel) => {
      if (data?.isSuccess) {
        this.formGroup?.reset();
        this.initNewForm();
        this.toaster.success(data?.message);
        this.getPurchaseQuotationDetailsById();
        this.getPurchaseQuotationProducts();
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

  fillEditForm(model: PurchaseQuotationModel) {
    this.isUpdate = true;

    this.formGroup.patchValue({
      purchaseQuotationId: model.purchaseQuotationId,
      // supplierId: quotationModel.supplierId,
      // orderDate:this.datePipe.transform(quotationModel.orderDate, 'yyyy-MM-dd'),
      // secondaryOrderId: quotationModel.secondaryOrderId,
      // branchId: quotationModel.branchId,
      notes:model.notes
      
    });
  }
  getSelectedSupplier(supplierId)
  {
    this.selectedSupplierId=supplierId;
  }
  public formErrors = {
    supplierId: '',
    orderId: '',
    price: '',
    branchId: '',
    orderDate:'',
    orderProducts: '',
    notes: ''
  };
  

}