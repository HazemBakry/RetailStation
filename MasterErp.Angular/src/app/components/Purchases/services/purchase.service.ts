import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PurchaseInvoiceModel } from '../models/PurchaseInvoiceModel';
import { PurchaseOrderModel } from '../models/PurchaseOrder';
import { PurchaseReturnsModel } from '../models/PurchaseReturns';
import { FilterModel, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { SupplierReturnsVoucherModel } from '../models/SupplierReturnsVoucherModel';
import { PagedResponseDTO } from '../../Shared/models/PagedResponseDTO';
import { OrderModel } from '../../Inventory/models/inventory';
import { SupplierModel } from '../models/SupplierModel';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { PurchaseQuotationModel, PurchaseQuotationDetailsModel } from '../models/PurchaseQuotationModel';
import { GeneralOrderDetailsModel } from '../../Inventory/models/GeneralOrderModel ';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  GetPurchaseInvoices_Data(model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<PurchaseInvoiceModel[]>>(this.URL + 'PurchaseInvoice/GetPurchaseInvoices_Data', model);
  }
  GetPurchaseInvoiceDetailsById(invoiceId: number) {
    return this.http.get<PurchaseInvoiceModel>(this.URL + `PurchaseInvoice/GetPurchaseInvoiceDetailsById?InvoiceId=${invoiceId}`);
  }
  GetPurchaseInvoiceProducts_Data(invoiceId: number) {
    return this.http.get<GeneralOrderDetailsModel[]>(this.URL + `PurchaseInvoice/GetPurchaseInvoiceProducts_Data?InvoiceId=${invoiceId}`);
  }

  AddNewPurchaseInvoice(model: PurchaseInvoiceModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'PurchaseInvoice/AddNewPurchaseInvoice', model);
  }
  
  EditPurchaseInvoice(invoiceId:number,model: PurchaseInvoiceModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `PurchaseInvoice/EditPurchaseInvoice?InvoiceId=${invoiceId}`, model);
  }




  CancelPurchaseInvoice(InvoiceId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'PurchaseInvoice/CancelPurchaseInvoice?InvoiceId=' + InvoiceId);
  }

  GetInvoiceTypesData() {
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/GetInvoiceTypesData');
  }


//////////////////////////////////////


  GetPurchaseQuotations_Data(model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<PurchaseQuotationModel[]>>(this.URL + 'PurchaseOrder/GetPurchaseQuotations_Data', model);
  }
  GetPurchaseQuotationDetailsById(purchaseQuotationId: number) {
    return this.http.get<PurchaseQuotationModel>(this.URL + `PurchaseOrder/GetPurchaseQuotationDetailsById?PurchaseQuotationId=${purchaseQuotationId}`);
  }
  GetPurchaseQuotationProducts_Data(purchaseQuotationId: number) {
    return this.http.get<PurchaseQuotationDetailsModel[]>(this.URL + `PurchaseOrder/GetPurchaseQuotationProducts_Data?PurchaseQuotationId=${purchaseQuotationId}`);
  }

  AddNewPurchaseQuotation(model: PurchaseQuotationModel) {
    return this.http.post<any>(this.URL + 'PurchaseOrder/AddNewPurchaseQuotation', model);
  }

  EditPurchaseQuotation(purchaseQuotationId:number,model: PurchaseQuotationModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `PurchaseOrder/EditPurchaseQuotation?PurchaseQuotationId=${purchaseQuotationId}`, model);
  }

  DeletePurchaseQuotation(purchaseQuotationId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'PurchaseOrder/DeletePurchaseQuotation?PurchaseQuotationId=' + purchaseQuotationId);
  }

  CancelPurchaseReturns(returnsId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'PurchaseInvoice/CancelPurchaseReturns?ReturnsId=' + returnsId);
  }

  GetPurchaseReturns_Data(model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<PurchaseReturnsModel[]>>(this.URL + 'PurchaseInvoice/GetPurchaseReturns_Data', model);
  }
  GetPurchaseReturnsDetailsById(orderId: number) {
    return this.http.get<PurchaseReturnsModel>(this.URL + `PurchaseInvoice/GetPurchaseReturnsDetailsById?OrderId=${orderId}`);
  }
  GetPurchaseReturnsProducts_Data(orderId: number) {
    return this.http.get<GeneralOrderDetailsModel[]>(this.URL + `PurchaseInvoice/GetPurchaseReturnsProducts_Data?OrderId=${orderId}`);
  }

  AddNewPurchaseReturns(model: PurchaseReturnsModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'PurchaseInvoice/AddNewPurchaseReturns', model);
  }
  EditPurchaseReturns(orderId:number,model: PurchaseReturnsModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `PurchaseInvoice/EditPurchaseReturns?OrderId=${orderId}`, model);
  }


  GetSupplierStatementData(supplierId) {
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/GetSupplierStatementData?SupplierId=' + supplierId);
  }

  GetInvoicesSearchData(supplierId: number, invoiceNumber: string, invoiceDate: string) {
    supplierId = supplierId ? supplierId : 0;
    invoiceNumber = invoiceNumber ? invoiceNumber : '';
    invoiceDate = invoiceDate ? invoiceDate : '';
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/GetInvoicesSearchData?SupplierId=' + supplierId + '&InvoiceNumber=' + invoiceNumber + '&InvoiceDate=' + invoiceDate);
  }

  GetPurchaseInvoiceDetails(invoiceId: number) {

    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/GetPurchaseInvoiceDetails?InvoiceId=' + invoiceId);
  }
  //------------------------------------- Purchase Order ----------------------------------
  GetPurchaseOrders_Data(model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<PurchaseOrderModel[]>>(this.URL + 'PurchaseOrder/GetPurchaseOrders_Data', model);
  }

  GetPurchaseOrderDetailsById(PurchaseOrderId: number) {
    return this.http.get<PurchaseOrderModel>(this.URL + 'PurchaseOrder/GetPurchaseOrderDetailsById?PurchaseOrderId=' + PurchaseOrderId);
  }
  GetPurchaseOrderProducts_Data(PurchaseOrderId: number) {
    return this.http.get<GeneralOrderDetailsModel[]>(this.URL + `PurchaseOrder/GetPurchaseOrderProducts_Data?PurchaseOrderId=${PurchaseOrderId}`);
  }
  AddNewPurchaseOrder(model: PurchaseOrderModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'PurchaseOrder/AddNewPurchaseOrder', model);
  }
  EditPurchaseOrder(PurchaseOrderId:number,model: PurchaseOrderModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'PurchaseOrder/EditPurchaseOrder?PurchaseOrderId=' + PurchaseOrderId, model);
  }
  CancelPurchaseOrder(PurchaseOrderId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'PurchaseOrder/CancelPurchaseOrder?PurchaseOrderId=' + PurchaseOrderId);
  }
  //--------------------------------------- Suppliers ---------------------------------------

  GetSuppliersData(model: FilterModel) {
    return this.http.post<any>(this.URL + 'Suppliers/GetSuppliersData', model);
  }

  GetSupplierDetailsById(supplierId: number, model: FilterModel) {
    return this.http.post<any>(this.URL + 'Suppliers/GetSupplierDetailsById?SupplierId=' + supplierId, model);
  }

  GetSuppliersByItemId(SupplierId: number) {
    return this.http.get<SupplierModel[]>(this.URL + 'Items/GetSuppliersByItemId?SupplierId=' + SupplierId);
  }

  AddNewSupplier(model: SupplierModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Suppliers/AddNewSupplier', model);
  }

  EditSupplier(supplierId: number, model: SupplierModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Suppliers/EditSupplier?SupplierId=' + supplierId, model);
  }

  DeleteSupplier(supplierId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Suppliers/DeleteSupplier?SupplierId=' + supplierId);
  }

  //--------------------------------------- Branches -----------------------------------------

  GetBranchesData() {
    return this.http.get<any[]>(this.URL + 'Branch/GetBranchesData');
  }

  GetSupplierReturnsVoucherData(model: FilterModel) {
    return this.http.post<any>(this.URL + 'SupplierReturnsVoucher/GetSupplierReturnsVoucherData', model);
  }

  CreateNewSupplierReturnsVoucher(model: SupplierReturnsVoucherModel) {
    return this.http.post<any>(this.URL + 'SupplierReturnsVoucher/CreateNewSupplierReturnsVoucher', model);
  }
}
