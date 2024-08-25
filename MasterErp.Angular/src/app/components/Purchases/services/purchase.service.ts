import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PurchaseInvoiceModel } from '../models/PurchaseInvoiceModel';
import { PurchaseOrderModel } from '../models/PurchaseOrder';
import { PurchaseReturnsModel } from '../models/PurchaseReturns';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { SupplierReturnsVoucherModel } from '../models/SupplierReturnsVoucherModel';
import { SupplierModel } from '../models/SupplierModel';
import { ActionsResponseModel } from '../../Shared/models/CreateModifyReturnsModel';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  GetPurchaseInvoicesSummary(model: FilterModel) {
    return this.http.post<any>(this.URL + 'PurchaseInvoice/GetPurchaseInvoicesSummary', model);
  }

  CancelPurchaseInvoice(InvoiceId: number) {
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/CancelPurchaseInvoice?InvoiceId=' + InvoiceId);
  }

  GetInvoiceTypesData() {
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/GetInvoiceTypesData');
  }

  CreateNewPurchaseInvoice(model: PurchaseInvoiceModel) {
    return this.http.post<any>(this.URL + 'PurchaseInvoice/CreateNewPurchaseInvoice', model);
  }

  CreateNewPurchaseReturns(model: PurchaseReturnsModel) {
    return this.http.post<any>(this.URL + 'PurchaseInvoice/CreateNewPurchaseReturns', model);
  }

  GetPurchasesReturnsData() {
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/GetPurchasesReturnsData');
  }

  CancelPurchaseReturns(returnsId: number) {
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/CancelPurchaseReturns?ReturnsId=' + returnsId);
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

  CreateNewPurchaseOrder(model: PurchaseOrderModel) {
    return this.http.post<any>(this.URL + 'PurchaseOrder/CreateNewPurchaseOrder', model);
  }

  GetPurchasesOrdersData(model: FilterModel) {
    return this.http.post<any>(this.URL + 'PurchaseOrder/GetPurchasesOrdersData', model);
  }

  CancelPurchaseOrder(orderId: number) {
    return this.http.get<any[]>(this.URL + 'PurchaseOrder/CancelPurchaseOrder?OrderId=' + orderId);
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
    return this.http.get<ActionsResponseModel>(this.URL + 'Supplier/DeleteSupplier?SupplierId=' + supplierId);
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
