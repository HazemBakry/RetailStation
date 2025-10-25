import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OrderModel } from '../models/inventory';
import { FilterItem, FilterModel, SearchFilterModel } from '../../Shared/models/FilterModel';
import { Unit } from '../models/unit';
import { PagedResponseDTO } from '../../Shared/models/PagedResponseDTO';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { SupplierModel } from '../../Purchases/models/SupplierModel';
import { MaterialRequestModel } from '../models/MaterialRequestModel ';
import { GeneralOrderDetailsModel } from '../models/GeneralOrderModel ';
import { MaterialReceiptModel } from '../models/MaterialReceiptModel';
import { MaterialIssueModel } from '../models/MaterialIssueModel';
import { ItemModel } from '../../Shared/models/ItemModel';
import { ItemCategoryModel } from '../../Shared/models/ItemCategory';
import { CategorySortModel } from '../../Shared/models/CategorySort';
import { ItemLookupDetailsModel, ItemLookupModel } from '../../Shared/models/ItemLookupModel';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  // -------------------------------------- Items -------------------------------------- //



  // GetItemsData() {
  //   return this.http.get<OrderDetailModel[]>(this.URL + 'Items/GetItemsData');
  // }






  GetItemsData(searchModel: SearchFilterModel) {
    return this.http.post<PagedResponseDTO<ItemModel[]>>(this.URL + 'Items/GetItemsData', searchModel);
  }

  GetItemDetailsById(itemId: number) {
    return this.http.get<ItemModel>(this.URL + `Items/GetItemDetailsById?ItemId=${itemId}`);
  }

  AddNewItem(model: ItemModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Items/AddNewItem', model);
  }

  EditItem(itemId: number, model: ItemModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Items/EditItem?ItemId=${itemId}`, model)
  }

  DeleteItem(itemId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `Items/DeleteItem?ItemId=${itemId}`);
  }
  ChangeItemActiveStatus(ItemId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Items/ChangeItemActiveStatus?ItemId=' + ItemId);
  }
  ItemQuickUpdate(ItemId: number, Price: number, UnitId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `Items/ItemQuickUpdate?ItemId=${ItemId}&Price=${Price}&UnitId=${UnitId}`);
  }
  ExportItems(searchModel: PagedResponseDTO, categoryId: number) {
    return this.http.post<ActionsResponseModel>(this.URL + `Items/ExportItems?CategoryId=${categoryId} `, searchModel);
  }
  GetSuppliersByItemId(itemId: number) {
    return this.http.get<PagedResponseDTO<SupplierModel[]>>(this.URL + `Suppliers/GetSuppliersByItemId?ItemId=${itemId} `);
  }
  GetItemsBySupplierId(supplierId: number) {
    return this.http.get<ItemModel[]>(this.URL + `Items/GetItemsBySupplierId?SupplierId=${supplierId} `);
  }

  GetItemsDeleted(ItemCategoryId: number, SearchText: string) {
    return this.http.get<any[]>(this.URL + 'Items/GetItemsDeleted?ItemCategoryId=' + ItemCategoryId + '&SearchText=' + SearchText);
  }

  GetItemsByCategoryId(CategoryId: number) {
    return this.http.get<any[]>(this.URL + 'Items/GetItemsByCategoryId?CategoryId=' + CategoryId);
  }

  ExportItemsDeleted(ItemCategoryId: number, SearchText: string, UserName: string) {
    return this.http.get<any>(this.URL + 'Items/ExportItemsDeleted?ItemCategoryId=' + ItemCategoryId + '&SearchText=' + SearchText + '&UserName=' + UserName);
  }

  //----------------------------------------------- Item Categories ---------------------------------------------//

  AddNewItemCategory(model: ItemCategoryModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Items/AddNewItemCategory', model);
  }

  EditItemCategory(categoryId: number, model: ItemCategoryModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Items/EditItemCategory?ItemCategoryId=${categoryId}`, model)
  }

  DeleteItemCategory(categoryId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `Items/DeleteItemCategory?ItemCategoryId=${categoryId}`);
  }

  GetItemCategories() {
    return this.http.get<PagedResponseDTO<ItemCategoryModel[]>>(this.URL + 'Items/GetItemCategories');
  }

  ChangeItemCategoryActiveStatus(CategoryId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Items/ChangeItemCategoryActiveStatus?CategoryId=' + CategoryId);
  }

  ChangeCategoriesDisplayOrder(SortedItems: CategorySortModel[]) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Items/ChangeCategoriesDisplayOrder', SortedItems);
  }

  //------------------------------------------------------- Units ------------------------------------------------------//

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


  // -------------------------------------- Inventory operations -------------------------------------- //

  GetInventoryList() {
    return this.http.get<any[]>(this.URL + 'Inventory/GetInventoryList');
  }

  GetInventoryStatistics() {
    return this.http.get<any>(this.URL + 'Inventory/GetInventoryStatistics');
  }

  GetMaterialReceipts_Data(model: SearchFilterModel) {
    return this.http.post<PagedResponseDTO<MaterialReceiptModel[]>>(this.URL + 'Inventory/GetMaterialReceipts_Data', model);
  }
  GetMaterialReceipts_Filters(model: SearchFilterModel) {
    return this.http.post<FilterModel[]>(this.URL + 'Inventory/GetMaterialReceipts_Filters', model);
  }

  GetMaterialReceiptDetailsById(materialReceiptId: number) {
    return this.http.get<MaterialReceiptModel>(this.URL + `Inventory/GetMaterialReceiptDetailsById?MaterialReceiptId=${materialReceiptId}`);
  }

  GetMaterialReceiptProducts_Data(materialReceiptIds: number[]) {
    return this.http.post<GeneralOrderDetailsModel[]>(this.URL + 'Inventory/GetMaterialReceiptProducts_Data', materialReceiptIds);
  }

  AddNewMaterialReceipt(model: MaterialReceiptModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Inventory/AddNewMaterialReceipt', model);
  }

  EditMaterialReceipt(materialReceiptId: number, model: MaterialReceiptModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Inventory/EditMaterialReceipt?MaterialReceiptId=' + materialReceiptId, model);
  }

  CancelMaterialReceipt(MaterialReceiptId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Inventory/CancelMaterialReceipt?MaterialReceiptId=' + MaterialReceiptId);
  }

  //-------------------------------------------- Purchase Receipt --------------------------------------------//

  GetPurchaseReceipts_Data(model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<OrderModel[]>>(this.URL + 'Inventory/GetPurchaseReceipts_Data', model);
  }

  GetPurchaseReceipts_Filters(model: SearchFilterModel) {
    return this.http.post<FilterModel[]>(this.URL + 'Inventory/GetPurchaseReceipts_Filters', model);
  }

  GetPurchaseReceiptDetailsById(orderId: number) {
    return this.http.get<OrderModel>(this.URL + `Inventory/GetPurchaseReceiptDetailsById?OrderId=${orderId}`);
  }

  GetPurchaseReceiptItems_Data(orderId: number) {
    return this.http.get<GeneralOrderDetailsModel[]>(this.URL + `Inventory/GetPurchaseReceiptItems_Data?OrderId=${orderId}`);
  }

  AddNewPurchaseReceipt(model: OrderModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Inventory/AddNewPurchaseReceipt', model);
  }

  EditPurchaseReceipt(receiptId: number, model: OrderModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Inventory/EditPurchaseReceipt?ReceiptId=${receiptId}`, model);
  }

  CancelPurchaseReceipt(receiptId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Inventory/CancelPurchaseReceipt?ReceiptId' + receiptId);
  }

  //-------------------------------------------- Material Issue Receipt --------------------------------------------//

  GetMaterialIssueReceipts_Data(model: FilterModel) {
    return this.http.post<PagedResponseDTO<OrderModel[]>>(this.URL + 'Inventory/GetMaterialIssueReceipts_Data', model);
  }

  GetMaterialIssueReceipts_Filters(model: FilterModel) {
    return this.http.post<FilterModel[]>(this.URL + 'Inventory/GetMaterialIssueReceipts_Filters', model);
  }

  GetMaterialIssueReceiptDetailsById(receiptId: number) {
    return this.http.get<OrderModel>(this.URL + `Inventory/GetMaterialIssueReceiptDetailsById?ReceiptId=${receiptId}`);
  }

  GetMaterialIssueReceiptItems_Data(receiptId: number) {
    return this.http.get<GeneralOrderDetailsModel[]>(this.URL + `Inventory/GetMaterialIssueReceiptItems_Data?ReceiptId=${receiptId}`);
  }

  AddNewMaterialIssueReceipt(model: OrderModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Inventory/AddNewMaterialIssueReceipt', model);
  }

  EditMaterialIssueReceipt(receiptId: number, model: OrderModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Inventory/EditMaterialIssueReceipt?ReceiptId=${receiptId}`, model);
  }

  CancelMaterialIssueReceipt(receiptId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Inventory/CancelMaterialIssueReceipt?ReceiptId' + receiptId);
  }

  // ------------------------------------------- Delivery Orders ------------------------------------------- //

  GetDeliveryNotes_Data(model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<OrderModel[]>>(this.URL + 'Inventory/GetDeliveryNotes_Data', model);
  }

  GetDeliveryNotes_Filters(model: SearchFilterModel) {
    return this.http.post<FilterModel[]>(this.URL + 'Inventory/GetDeliveryNotes_Filters', model);
  }

  GetDeliveryNoteDetailsById(orderId: number) {
    return this.http.get<OrderModel>(this.URL + `Inventory/GetDeliveryNoteDetailsById?OrderId=${orderId}`);
  }

  GetDeliveryNoteProducts_Data(orderId: number) {
    return this.http.get<GeneralOrderDetailsModel[]>(this.URL + `Inventory/GetDeliveryNoteProducts_Data?OrderId=${orderId}`);
  }

  AddNewDeliveryNote(model: OrderModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Inventory/AddNewDeliveryNote', model);
  }

  EditDeliveryNote(orderId: number, model: OrderModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Inventory/EditDeliveryNote?OrderId=${orderId}`, model);
  }

  CancelDeliveryNote(OrderId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Inventory/CancelDeliveryNote?OrderId' + OrderId);
  }

  GetOrdersSearchData(supplierId: number, orderNumber: string, orderDate: string) {
    supplierId = supplierId ? supplierId : 0;
    orderNumber = orderNumber ? orderNumber : '';
    orderDate = orderDate ? orderDate : '';
    return this.http.get<any[]>(this.URL + 'Inventory/GetOrdersSearchData?SupplierId=' + supplierId + '&OrderNumber=' + orderNumber + '&OrderDate=' + orderDate);
  }


  // ------------------------------------------- Material Issue ------------------------------------------- //

  GetMaterialIssue_Data(model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<MaterialIssueModel[]>>(this.URL + 'Inventory/GetMaterialIssue_Data', model);
  }

  GetMaterialIssue_Filters(model: SearchFilterModel) {
    return this.http.post<FilterModel[]>(this.URL + 'Inventory/GetMaterialIssue_Filters', model);
  }

  GetMaterialIssueDetailsById(materialIssueId: number) {
    return this.http.get<MaterialIssueModel>(this.URL + `Inventory/GetMaterialIssueDetailsById?MaterialIssueId=${materialIssueId}`);
  }

  GetMaterialIssueProducts_Data(materialIssueId: number) {
    return this.http.get<GeneralOrderDetailsModel[]>(this.URL + `Inventory/GetMaterialIssueProducts_Data?MaterialIssueId=${materialIssueId}`);
  }

  AddNewMaterialIssue(model: MaterialIssueModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Inventory/AddNewMaterialIssue', model);
  }

  EditMaterialIssue(materialIssueId: number, model: MaterialIssueModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Inventory/EditMaterialIssue?MaterialIssueId=${materialIssueId}`, model);
  }

  CancelMaterialIssue(materialIssueId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Inventory/CancelMaterialIssue?MaterialIssueId=' + materialIssueId);
  }
  //----------------------------------------- Supplier Vouchers ------------------------------------//

  GetSupplierVouchers_Data(model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<OrderModel[]>>(this.URL + 'Inventory/GetSupplierVouchers_Data', model);
  }

  CancelSupplierVoucher(OrderId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Inventory/CancelSupplierVoucher?OrderId' + OrderId);
  }

  //----------------------------------------- Material Requests ------------------------------------//

  GetMaterialRequests_Data(model: FilterModel) {
    return this.http.post<PagedResponseDTO<MaterialRequestModel[]>>(this.URL + 'Inventory/GetMaterialRequests_Data', model);
  }
  GetMaterialRequests_Filters(model: PagedResponseDTO<any[]>) {
    return this.http.post<FilterItem[]>(this.URL + 'Inventory/GetMaterialRequests_Filters', model);
  }

  GetMaterialRequestDetailsById(materialRequestId: number) {
    return this.http.get<MaterialRequestModel>(this.URL + 'Inventory/GetMaterialRequestDetailsById?MaterialRequestId=' + materialRequestId);
  }

  CreateNewMaterialRequest(model: MaterialRequestModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Inventory/CreateNewMaterialRequest', model);
  }

  EditMaterialRequest(materialRequestId: number, model: MaterialRequestModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Inventory/EditMaterialRequest?MaterialRequestId=${materialRequestId}`, model);
  }

  CancelMaterialRequest(MaterialRequestId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Inventory/CancelMaterialRequest?MaterialRequestId=' + MaterialRequestId);
  }

  GetMaterialRequestProducts_Data(materialRequestIds: number[]) {
    return this.http.post<GeneralOrderDetailsModel[]>(this.URL + `Inventory/GetMaterialRequestProducts_Data`, materialRequestIds);
  }



  ///////////////////// Item Lookups

  GetItemLookups_Data(model: FilterModel) {
    return this.http.post<PagedResponseDTO<ItemLookupModel[]>>(this.URL + 'Items/GetItemLookups_Data', model);
  }
  GetItemLookupDetailsById(itemLookupId: number) {
    return this.http.get<MaterialRequestModel>(this.URL + 'Items/GetMaterialRequestDetailsById?ItemLookupId=' + itemLookupId);
  }


  GetItemsByLookupId(LookupId: number) {
    return this.http.get<GeneralOrderDetailsModel[]>(this.URL + 'Items/GetItemsByLookupId?ItemLookupId=' + LookupId);
  }

  CreateNewItemLookup(model: ItemLookupModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Items/CreateNewItemLookup', model);
  }

  EditItemLookup(itemLookupId: number, model: ItemLookupModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Items/EditItemLookup?ItemLookupId=${itemLookupId}`, model);
  }

  DeleteItemLookup(ItemLookupId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Items/DeleteItemLookup?ItemLookupId=' + ItemLookupId);
  }

  AddItemsToLookup(itemLookupId: number, model: ItemLookupDetailsModel[]) {
    return this.http.post<ActionsResponseModel>(this.URL + `Items/AddItemsToLookup?ItemLookupId=${itemLookupId}`, model);
  }
  GetItemsLookups() {
    return this.http.get<any[]>(this.URL + 'Items/GetItemsLookups');
  }

  //----------------------------------------- Inventory reports ---------------------------------------------

  GetItemsPricesFollowUp_Data(fromDate: any, toDate: any, model: SearchFilterModel) {
    fromDate = fromDate ?? '';
    toDate = toDate ?? '';
    return this.http.post<PagedResponseDTO<any[]>>(this.URL + 'InventoryReports/GetItemsPricesFollowUp_Data?FromDate=' + fromDate + '&ToDate=' + toDate, model);
  }

  GetItemsPricesFollowUp_Filters(fromDate: any, toDate: any, model: SearchFilterModel) {
    fromDate = fromDate ?? '';
    toDate = toDate ?? '';
    return this.http.post<any>(this.URL + 'InventoryReports/GetItemsPricesFollowUp_Filters?FromDate=' + fromDate + '&ToDate=' + toDate, model);
  }

  GetItemsPricesFollowUp_Export(fromDate: any, toDate: any, model: SearchFilterModel) {
    fromDate = fromDate ?? '';
    toDate = toDate ?? '';
    return this.http.post<any>(this.URL + 'InventoryReports/GetItemsPricesFollowUp_Export?FromDate=' + fromDate + '&ToDate=' + toDate, model);
  }

  GetReceivedItemsSummaryReport_Data(fromDate: any, toDate: any, model: SearchFilterModel) {
    fromDate = fromDate ?? '';
    toDate = toDate ?? '';
    return this.http.post<PagedResponseDTO<any[]>>(this.URL + 'InventoryReports/GetReceivedItemsSummaryReport_Data?FromDate=' + fromDate + '&ToDate=' + toDate, model);
  }
  GetReceivedItemsSummaryReport__Filters(fromDate: any, toDate: any, model: SearchFilterModel) {
    fromDate = fromDate ?? '';
    toDate = toDate ?? '';
    return this.http.post<any>(this.URL + 'InventoryReports/GetReceivedItemsSummaryReport__Filters?FromDate=' + fromDate + '&ToDate=' + toDate, model);
  }

  GetReceivedItemsSummaryReport_Export(fromDate: any, toDate: any, model: SearchFilterModel) {
    fromDate = fromDate ?? '';
    toDate = toDate ?? '';
    return this.http.post<any>(this.URL + 'InventoryReports/GetReceivedItemsSummaryReport_Export?FromDate=' + fromDate + '&ToDate=' + toDate, model);
  }



  GetReceivedItemsDetailsReport_Data(fromDate: any, toDate: any, model: SearchFilterModel) {
    fromDate = fromDate ?? '';
    toDate = toDate ?? '';
    return this.http.post<PagedResponseDTO<any[]>>(this.URL + 'InventoryReports/GetReceivedItemsDetailsReport_Data?FromDate=' + fromDate + '&ToDate=' + toDate, model);
  }
  GetReceivedItemsDetailsReport_Filters(fromDate: any, toDate: any, model: SearchFilterModel) {
    fromDate = fromDate ?? '';
    toDate = toDate ?? '';
    return this.http.post<any>(this.URL + 'InventoryReports/GetReceivedItemsSummaryReport__Filters?FromDate=' + fromDate + '&ToDate=' + toDate, model);
  }
  GetReceivedItemsDetailsReport_Export(fromDate: any, toDate: any, model: SearchFilterModel) {
    fromDate = fromDate ?? '';
    toDate = toDate ?? '';
    return this.http.post<any>(this.URL + 'InventoryReports/GetReceivedItemsDetailsReport_Export?FromDate=' + fromDate + '&ToDate=' + toDate, model);
  }

  GetMaterialReceiptsReport_Data(fromDate: any, toDate: any, model: SearchFilterModel) {
    fromDate = fromDate ?? '';
    toDate = toDate ?? '';
    return this.http.post<PagedResponseDTO<any[]>>(this.URL + 'InventoryReports/GetMaterialReceiptsReport_Data?FromDate=' + fromDate + '&ToDate=' + toDate, model);
  }
  GetMaterialReceiptsReport_Filters(fromDate: any, toDate: any, model: SearchFilterModel) {
    fromDate = fromDate ?? '';
    toDate = toDate ?? '';
    return this.http.post<any>(this.URL + 'InventoryReports/GetMaterialReceiptsReport_Filters?FromDate=' + fromDate + '&ToDate=' + toDate, model);
  }
  GetMaterialReceiptsReport_Export(fromDate: any, toDate: any, model: SearchFilterModel) {
    fromDate = fromDate ?? '';
    toDate = toDate ?? '';
    return this.http.post<any>(this.URL + 'InventoryReports/GetMaterialReceiptsReport_Export?FromDate=' + fromDate + '&ToDate=' + toDate, model);
  }

}
