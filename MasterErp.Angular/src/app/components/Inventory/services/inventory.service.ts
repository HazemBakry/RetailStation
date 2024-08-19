import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ReceiveOrderModel } from '../models/inventory';
import { FilterModel } from '../../Shared/models/FilterModel';
import { ItemModel } from '../models/Item';
import { PurchaseRequestModel } from '../models/PurchasesRequestModel';
import { Unit } from '../models/unit';
import { PagedResponseDTO } from '../../Shared/models/PagedResponseDTO';
import { ActionsResponseModel } from '../../Shared/models/CreateModifyReturnsModel';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  // -------------------------------------- Items -------------------------------------- //

  GetItems(searchModel: PagedResponseDTO,categoryId: number=0) {
    return this.http.post<PagedResponseDTO<ItemModel[]>>(this.URL + `Items/GetItems?CategoryId=${categoryId} `,searchModel);
  }

  GetItemById(itemId: number) {
    return this.http.get<ItemModel>(this.URL + `Items/GetItemById?ItemId=${itemId}`);
  }

  AddNewItem(model: ItemModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Items/AddNewItem', model);
  }

  EditItem(itemId: number, model: ItemModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Items/EditItem?ItemId=${itemId}`,model)
  }

  DeleteItem(itemId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `Items/DeleteItem?ItemId=${itemId}`);
  }


  ExportItems(searchModel: PagedResponseDTO,categoryId: number) {
    return this.http.post<PagedResponseDTO<ItemModel[]>>(this.URL + `Items/ExportItems?CategoryId=${categoryId} `,searchModel);
  }

  GetItemsDeleted(ItemCategoryId: number, SearchText: string) {
    return this.http.get<any[]>(this.URL + 'Items/GetItemsDeleted?ItemCategoryId=' + ItemCategoryId + '&SearchText=' + SearchText);
  }

  GetItemCategories() {
    return this.http.get<any[]>(this.URL + 'Items/GetItemCategories');
  }

  GetItemsByCategoryId(CategoryId: number) {
    return this.http.get<any[]>(this.URL + 'Items/GetItemsByCategoryId?CategoryId=' + CategoryId);
  }


  ExportItemsDeleted(ItemCategoryId: number, SearchText: string, UserName: string) {
    return this.http.get<any>(this.URL + 'Items/ExportItemsDeleted?ItemCategoryId=' + ItemCategoryId + '&SearchText=' + SearchText + '&UserName=' + UserName);
  }

  GetUnits() {
    return this.http.get<any>(this.URL + 'Items/GetUnits');
  }

  AddNewUnit(model: Unit) {
    return this.http.post<any>(this.URL + 'Items/AddUnit', model);
  }

  EditUnit(model: Unit) {
    return this.http.post<any>(this.URL + 'Items/EditUnit', model);
  }

  DeleteUnit(UnitId: number[]) {
    return this.http.post<any>(this.URL + 'Items/DeleteUnit', UnitId);
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
