import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ReceiveOrderModel } from '../models/inventory';
import { FilterModel } from '../../Shared/models/FilterModel';
import { RawItemModel } from '../models/rawItem';
import { PurchaseRequestModel } from '../models/PurchasesRequestModel';
import { Unit } from '../models/unit';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  // -------------------------------------- Items -------------------------------------- //

  GetItemsList(RawCategoryId: number, SearchText: string) {
    return this.http.get<any[]>(this.URL + 'Item/GetItemsList?RawCategoryId=' + RawCategoryId + '&SearchText=' + SearchText);
  }

  GetRawItemsDeleted(RawCategoryId: number, SearchText: string) {
    return this.http.get<any[]>(this.URL + 'RawItem/GetRawItemsDeleted?RawCategoryId=' + RawCategoryId + '&SearchText=' + SearchText);
  }

  GetRawItemCategories() {
    return this.http.get<any[]>(this.URL + 'RawItem/GetRawItemCategories');
  }

  GetRawItemsByCategoryId(CategoryId: number) {
    return this.http.get<any[]>(this.URL + 'RawItem/GetRawItemsByCategoryId?CategoryId=' + CategoryId);
  }

  GetRawItemDetailsByRawItemId(RawItemId: number) {
    return this.http.get<any>(this.URL + 'RawItem/GetRawItemDetailsByRawItemId?RawItemId=' + RawItemId);
  }

  AddNewRawItem(model: RawItemModel) {
    return this.http.post<any>(this.URL + 'RawItem/AddNewRawItem', model);
  }

  EditRawItem(model: RawItemModel) {
    return this.http.post<any>(this.URL + 'RawItem/EditRawItem', model);
  }

  DeleteRawItem(RawItemId: number[]) {
    return this.http.post<any>(this.URL + 'RawItem/DeleteRawItem', RawItemId);
  }

  ExportRawItems(RawCategoryId: number, SearchText: string, UserName: string) {
    return this.http.get<any>(this.URL + 'RawItem/ExportRawItems?RawCategoryId=' + RawCategoryId + '&SearchText=' + SearchText + '&UserName=' + UserName);
  }

  ExportRawItemsDeleted(RawCategoryId: number, SearchText: string, UserName: string) {
    return this.http.get<any>(this.URL + 'RawItem/ExportRawItemsDeleted?RawCategoryId=' + RawCategoryId + '&SearchText=' + SearchText + '&UserName=' + UserName);
  }

  GetUnits() {
    return this.http.get<any>(this.URL + 'Item/GetUnits');
  }

  AddNewUnit(model: Unit) {
    return this.http.post<any>(this.URL + 'Item/AddUnit', model);
  }

  EditUnit(model: Unit) {
    return this.http.post<any>(this.URL + 'Item/EditUnit', model);
  }

  DeleteUnit(UnitId: number[]) {
    return this.http.post<any>(this.URL + 'Item/DeleteUnit', UnitId);
  }


  // -------------------------------------- Receive Orders -------------------------------------- //

  GetReceiveOrdersSummary(model: FilterModel) {
    return this.http.post<any>(this.URL + 'Inventory/GetReceiveOrdersSummary', model);
  }

  GetInventoryList() {
    return this.http.get<any[]>(this.URL + 'Inventory/GetInventoryList');
  }

  CreateNewReceiveOrder(model: ReceiveOrderModel) {
    return this.http.post<any>(this.URL + 'Inventory/CreateNewReceiveOrder', model);
  }

  GetOrdersSearchData(supplierId: number, orderNumber: string, orderDate: string) {
    supplierId = supplierId ? supplierId : 0;
    orderNumber = orderNumber ? orderNumber : '';
    orderDate = orderDate ? orderDate : '';
    return this.http.get<any[]>(this.URL + 'Inventory/GetOrdersSearchData?SupplierId=' + supplierId + '&OrderNumber=' + orderNumber + '&OrderDate=' + orderDate);
  }

  CancelReceiveOrder(OrderId: number) {
    return this.http.get<any[]>(this.URL + 'Inventory/CancelReceiveOrder?=OrderId' + OrderId);
  }



  ///////////////////

  GetPurchasesRequestsData(model: FilterModel) {
    return this.http.post<any>(this.URL + 'PurchasesRequests/GetPurchasesRequestsData', model);
  }

  CreateNewPurchasesRequest(model: PurchaseRequestModel) {
    return this.http.post<any>(this.URL + 'PurchasesRequests/CreateNewPurchasesRequest', model);
  }
}
