import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PurchaseInvoiceModel } from '../models/PurchaseInvoiceModel';
import { PurchaseOrderModel } from '../models/PurchaseOrder';
import { PurchaseReturnsModel } from '../models/PurchaseReturns';
import { OrderDetailModel } from 'src/app/components/Shared/models/ItemModel';
import { FilterModel, SearchFilterModel } from 'src/app/components/Shared/models/FilterModel';
import { SupplierReturnsVoucherModel } from '../models/SupplierReturnsVoucherModel';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  GetPurchaseInvoicesSummary(model: FilterModel) {
    return this.http.post<any>(this.URL + 'PurchaseInvoice/GetPurchaseInvoicesSummary', model);
  }

  CancelPurchaseInvoice(InvoiceId:number) {
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/CancelPurchaseInvoice?InvoiceId='+InvoiceId);
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

  CancelPurchaseReturns(returnsId:number) {
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/CancelPurchaseReturns?ReturnsId='+returnsId);
  }

  GetSupplierStatementData(supplierId) {
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/GetSupplierStatementData?SupplierId='+supplierId);
  }

  GetInvoicesSearchData(supplierId:number,invoiceNumber:string,invoiceDate:string) {
    supplierId=supplierId?supplierId:0;
    invoiceNumber=invoiceNumber?invoiceNumber:'';
    invoiceDate=invoiceDate?invoiceDate:'';
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/GetInvoicesSearchData?SupplierId='+supplierId+'&InvoiceNumber='+invoiceNumber+'&InvoiceDate='+invoiceDate);
  }

  GetPurchaseInvoiceDetails(invoiceId:number) {
   
    return this.http.get<any[]>(this.URL + 'PurchaseInvoice/GetPurchaseInvoiceDetails?InvoiceId='+invoiceId);
  }
  //------------------------------------- Purchase Order ----------------------------------

  CreateNewPurchaseOrder(model: PurchaseOrderModel) {
    return this.http.post<any>(this.URL + 'PurchaseOrder/CreateNewPurchaseOrder', model);
  }

  GetPurchasesOrdersData(model: FilterModel) {
    return this.http.post<any>(this.URL + 'PurchaseOrder/GetPurchasesOrdersData', model);
  }

  CancelPurchaseOrder(orderId:number) {
    return this.http.get<any[]>(this.URL + 'PurchaseOrder/CancelPurchaseOrder?OrderId='+orderId);
  }

  //---------------------------------------- Items ----------------------------------------

  GetItemsLookups() {
    return this.http.get<any[]>(this.URL + 'Items/GetItemsLookups');
  }

  GetItemsData() {
    return this.http.get<OrderDetailModel[]>(this.URL + 'Items/GetItemsData');
  }

  GetItemsByLookupId(LookupId: number) {
    return this.http.get<OrderDetailModel[]>(this.URL + 'Items/GetItemsByLookupId?LookupId=' + LookupId);
  }

  GetItemsBySupplierId(SupplierId: number) {
    return this.http.get<OrderDetailModel[]>(this.URL + 'Items/GetItemsBySupplierId?SupplierId=' + SupplierId);
  }

  //--------------------------------------- Suppliers ---------------------------------------

  GetSuppliersData() {
    return this.http.get<any[]>(this.URL + 'Suppliers/GetSuppliersData');
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
