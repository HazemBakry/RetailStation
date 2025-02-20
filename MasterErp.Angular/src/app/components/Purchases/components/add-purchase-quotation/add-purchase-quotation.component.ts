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
import { OrderModel, OrderProductModel } from 'src/app/components/Inventory/models/inventory';
import { InventoryService } from 'src/app/components/Inventory/services/inventory.service';
import { PurchaseQuotationDetailsModel, PurchaseQuotationModel } from '../../models/PurchaseQuotationModel';
import { CustomValidators } from 'src/app/components/Shared/services/custom-validators';

@Component({
  selector: 'app-add-purchase-quotation',
  templateUrl: './add-purchase-quotation.component.html',
  styleUrls: ['./add-purchase-quotation.component.css']
})
export class AddPurchaseQuotationComponent implements OnInit {

  purchaseQuotationModel : PurchaseQuotationModel ={} as PurchaseQuotationModel;
  purchaseQuotationId:number;
  quotationProducts : PurchaseQuotationDetailsModel[]=[];
  quotationProductsEditList : PurchaseQuotationDetailsModel[]=[];
  isUpdate: boolean = false;
  clearAllProducts: boolean = false;

  suppliersSelectorData: FormDropdownModel[] = [];
  itemsSelectorData: FormDropdownModel[] = [];

  showLoader: boolean = false;
  showAddLoader: boolean = false;
  supplierImageFile: File;
  formData: FormData = new FormData();
  public formGroup: FormGroup;

  selectedPurchaseInvoice: OrderModel = {} as OrderModel;
  selectedSupplierIds: number []=[];
  selectedSuppliers: FormDropdownModel []=[];
  selectedItemIds: number []=[];
  selectedItems: FormDropdownModel []=[];

  constructor(private acRoute: ActivatedRoute, private router: Router, private modalService: NgbModal, private inventoryService: InventoryService,
    private purchaseService: PurchaseService, private sharedService: SharedService, private form: FormBuilder, private _FormService: FormService,
    private datePipe: DatePipe, private toaster: ToastrService, private offcanvasService: NgbOffcanvas,) { }


  ngOnInit(): void {
    this.acRoute.queryParams.subscribe((params: any) => {
      if (params.PurchaseQuotationId) {
        this.purchaseQuotationId = params.PurchaseQuotationId;
        this.getPurchaseQuotationDetailsById();
        // this.getPurchaseQuotationProducts();
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
        this.initNewForm(this.purchaseQuotationModel);
        // this.fillEditForm(this.purchaseQuotationModel);
        this.getPurchaseQuotationProducts();

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
      this.quotationProductsEditList = data;
      if (this.quotationProductsEditList.length>0) {

        var supplierIds:number[]=[];
        var itemIds:number[]=[];

        this.quotationProductsEditList.forEach(prod => {
          if(prod.itemId && !itemIds.some(x=>prod.itemId === x))
          {
            itemIds.push(prod.itemId);
            // if (!this.itemsSelectorData.length) {
            //   this.itemsSelectorData.push({value: prod.itemId,name: prod.itemNameAR});
            // }
          }
          if(prod.supplierId && !supplierIds.some(x=>prod.supplierId === x))
          {
             supplierIds.push(prod.supplierId);
            //  if (!this.suppliersSelectorData.length) {
              
            //    this.suppliersSelectorData.push({value: prod.supplierId,name: prod.supplierNameAR});
            //  }
          }

        });
        // this.getSelectedItems(itemIds);
        // this.getSelectedSuppliers(supplierIds);
        // this.prepareProductList();
        this.formGroup.patchValue({selectedItemIds:itemIds});
        this.formGroup.patchValue({selectedSupplierIds:supplierIds});
        this.formGroup.patchValue({quotationProducts:this.quotationProductsEditList});

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
    this.formGroup.patchValue({quotationProducts:products});
  }

  initNewForm(quotationModel: PurchaseQuotationModel = null) {
    // this.selectedPurchaseInvoice = {} as PurchaseQuotationModel;
    this.quotationProducts=[];
    this.quotationProductsEditList=[];
    this.selectedSupplierIds =[];
    this.selectedItemIds =[];
    this.selectedSuppliers =[];
    this.selectedItems =[];
    this.clearAllProducts=!this.clearAllProducts;
    this.isUpdate = false;
    this.buildForm();
    if (quotationModel)
      this.fillEditForm(quotationModel);
  }

  buildForm() {
    this.formGroup = this.form.group({
      orderId: [null],
      purchaseQuotationId: [null],
      quotationNumber: [null],
      quotationDate: [null],
      isLocked: [null],
      isCancelled:[null],
      notes:[null],
      quotationProducts: [[] as PurchaseQuotationDetailsModel[], [Validators.required,Validators.minLength(2)]],
      selectedItemIds: [[],[Validators.required]],
      selectedSupplierIds: [[],[Validators.required]],
      // selectedSupplierIds: [[],[Validators.required,CustomValidators.arrayLengthValidator(1,3,'يجب ان لا يزيد الموردين عن 3')]],
    });
    this.formGroup.valueChanges.subscribe((data) => {
      this.formErrors = this._FormService.validateForm(this.formGroup, this.formErrors, true);

    });
  }


  savePurchaseQuotation() {
    if(this.quotationProducts.length === 0) 
      this.toaster.warning('لا يوجد اصناف');
    else if(this.quotationProducts.some(x=>!x.itemId||!x.supplierId||!x.price)){
      this.toaster.warning('املئ جميع اسعار الموردين' );
      return
    }
    this.formGroup.patchValue({quotationProducts:this.quotationProducts});


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
    this.sharedService.GetItemsSelector().subscribe((data: FormDropdownModel[]) => {
      this.itemsSelectorData = data;
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
      quotationNumber:  model.quotationNumber,
      quotationDate: this.datePipe.transform( model.quotationNumber, 'yyyy-MM-dd'),
      isLocked:  model.isLocked,
      isCancelled: model.isCancelled,
      quotationProducts:  model.quotationProducts,
      notes:model.notes
      
    });
  }

  getSelectedSuppliers(supplierIds:number[])
  {    
    this.selectedSupplierIds = supplierIds;
    this.selectedSuppliers = this.suppliersSelectorData.filter(supplier => supplierIds.some(supplierId=>supplierId==supplier.value)).map(supplier=>({...supplier}));
    this.prepareProductList();

  }
  getSelectedItems(itemIds:number[])
  {
    this.selectedItemIds = itemIds;
    this.selectedItems = this.itemsSelectorData.filter(item => itemIds.some(itemId=>itemId==item.value)).map(item=>({...item}));
    this.prepareProductList();
  }
  prepareProductList()
  {
    this.quotationProducts = [];
    this.selectedItems.forEach(item => {
       this.selectedSuppliers.forEach(supplier => {
        var product:PurchaseQuotationDetailsModel={
          itemId: item.value,
          itemNameAR:item.name,
          itemNameEN:item.name,
          supplierId:supplier.value,
          supplierNameAR:supplier.name,
          supplierNameEN:supplier.name,
          price : this.isUpdate ? this.quotationProductsEditList.find(p => p.supplierId === supplier.value&&p.itemId === item.value)?.price : null
        };
        this.quotationProducts.push(product);
      });
    });
  }

  getSupplierPrice(itemId: number, supplierId: number): number {
    const supplierPrice = this.quotationProducts.find((sp: PurchaseQuotationDetailsModel) => sp.supplierId === supplierId && sp.itemId === itemId);
    return supplierPrice ? supplierPrice.price : 0;
  }

  updateSupplierPrice(itemId: number, supplierId: number, newPrice: number): void {
    const supplierPrice = this.quotationProducts.find((sp: PurchaseQuotationDetailsModel) => sp.supplierId === supplierId && sp.itemId === itemId);
    if (supplierPrice&&newPrice) {
      supplierPrice.price = +newPrice;
    }
  }
  public formErrors = {
    purchaseQuotationId: '',
    quotationNumber: '',
    quotationDate: '',
    isLocked: '',
    isCancelled:'',
    quotationProducts: '',
    notes: '',
    selectedItemIds: '',
    selectedSupplierIds: '',
  };
  

}