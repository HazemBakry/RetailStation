import { Component, OnInit } from '@angular/core';
import { OrderDetailModel } from 'src/app/Models/ItemModel';
import { SalesService } from '../../services/sales.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SalesInvoiceModel } from '../../models/SalesInvoiceModel';
import { CreateModifyReturnsModel } from 'src/app/components/Shared/models/CreateModifyReturnsModel';
import { SharedService } from 'src/app/components/Shared/services/shared.service';

@Component({
  selector: 'app-add-sales-invoice',
  templateUrl: './add-sales-invoice.component.html',
  styleUrls: ['./add-sales-invoice.component.css'],
})
export class AddSalesInvoiceComponent implements OnInit {
  BranchesList: any[] = [];
  ProductsList: OrderDetailModel[] = [];
  ItemsBySupplier: OrderDetailModel[] = [];
  InvoiceNumber = '';
  itemsCount:number = 0;
  showLoader: boolean=false;
  isPercentage:boolean=false;
  discountValue:number;
  taxPercent:number=0.15;
  clearAllProducts: boolean = false;
  salesInvoiceModel: SalesInvoiceModel = {} as SalesInvoiceModel;
  constructor(
    private salesService: SalesService,
    private sharedService:SharedService,
    private modalService: NgbModal,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.taxPercent=this.sharedService.taxPercent;
  }

  GetSelectedProductsList(products: OrderDetailModel[]) {
    this.ProductsList = products;
    this.salesInvoiceModel.items=products;

    this.calculatePrice();
    
  }
  calculatePrice()
  {
    this.itemsCount= this.salesInvoiceModel.items?.filter(item => item.quantity>0)
    .reduce((sum, current) => sum + current.quantity, 0);
    this.salesInvoiceModel.subTotal= this.salesInvoiceModel.items?.filter(item => item.itemTotalValue>0)
    .reduce((sum, current) => sum + current.itemTotalValue, 0);

    if (this.salesInvoiceModel.discount) {
      this.salesInvoiceModel.totalValue =
        this.salesInvoiceModel.subTotal - this.salesInvoiceModel.discount;
    } else if (this.salesInvoiceModel.discountPercent) {
      this.salesInvoiceModel.totalValue =
        this.salesInvoiceModel.subTotal -
        (this.salesInvoiceModel.subTotal * (this.salesInvoiceModel.discountPercent/100));
    } else {
      this.salesInvoiceModel.totalValue = this.salesInvoiceModel.subTotal;
    }
    this.salesInvoiceModel.taxPercent=this.taxPercent;

    var tax=this.sharedService.calculateTaxValue(this.salesInvoiceModel.totalValue);
    this.salesInvoiceModel.netValue=this.salesInvoiceModel.totalValue-tax;
  }
  setDiscountValue()
  {
    // const discountValue=event.target.value;
    this.salesInvoiceModel.discount=null;
    this.salesInvoiceModel.discountPercent=null;
    if(this.discountValue&&this.discountValue>0)
    {
        if(this.isPercentage)
        {
          this.salesInvoiceModel.discountPercent=Number(this.discountValue);
          this.salesInvoiceModel.discount=(this.salesInvoiceModel.subTotal*
                                          (this.salesInvoiceModel.discountPercent/100));
        }
        else{
          this.salesInvoiceModel.discount=Number(this.discountValue);
          this.salesInvoiceModel.discountPercent=((this.salesInvoiceModel.discount*100)/(this.salesInvoiceModel.subTotal));
        }
    }

    this.calculatePrice();
  }
  CreateNewSalesInvoice() {
    if (!this.validateFields()) {
      return;
    }

    this.salesService
      .CreateNewSalesInvoice(this.salesInvoiceModel)
      .subscribe((data: CreateModifyReturnsModel) => {
        if (data?.status) {
          // this.ClearAllFields();
          this.salesInvoiceModel.invoiceNumber = data.id;
          this.toaster.success(data?.message);
        } else {
          this.toaster.error(data?.message);
        }
      });
  }

  validateFields(): boolean {
    let model: SalesInvoiceModel = this.salesInvoiceModel;

    if (
      model.items?.length==0 ||
      !model.docNumber ||
      !model.invoiceDate ||
      !model.totalValue ||
      !model.taxPercent ||
      !model.subTotal
      
    ) {
      this.toaster.warning('يرجي ملئ جميع الخانات');
      return false;
    }
    return true;
  }
  ClearAllFields() {
    this.InvoiceNumber = '';
    this.salesInvoiceModel = {} as SalesInvoiceModel;
    this.ProductsList = [];
    this.clearAllProducts = !this.clearAllProducts;
  }
  Print() {}
}
