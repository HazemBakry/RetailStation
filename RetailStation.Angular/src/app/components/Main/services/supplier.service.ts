import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { FilterItem, FilterModel } from '../../Shared/models/FilterModel';
import { PagedResponseModel } from '../../Shared/models/PagedResponseDTO';
import { WebsiteOrderModel } from '../../Website/models/WebsiteOrderModel ';
import { MerchantItemModel } from '../../Shared/models/MerchantItemModel';
import { PaymentReceiptModel } from '../../Shared/models/PaymentReceiptModel';


@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }



  /////////////////////////////// SupplierItems ////////////////////////

  GetSupplierItemsData(searchModel: PagedResponseModel<MerchantItemModel[]>) {
    return this.http.post<PagedResponseModel<MerchantItemModel[]>>(this.URL + 'SupplierManagement/GetSupplierItemsData', searchModel);
  }

  GetSupplierItemDetailsById(itemId: number) {
    return this.http.get<MerchantItemModel>(this.URL + `SupplierManagement/GetSupplierItemDetailsById?merchantItemId=${itemId}`);
  }

  AddNewSupplierItem(model: FormData) {
    return this.http.post<ActionsResponseModel>(this.URL + 'SupplierManagement/AddNewSupplierItem', model);
  }
  ImportSupplierItemsFile(importerName:string,file: FormData) {
    return this.http.post<ActionsResponseModel>(this.URL + 'SupplierManagement/ImportSupplierItemsFile?ImporterName='+importerName, file);
  }

  EditSupplierItem(itemId: number, model: FormData) {
    return this.http.post<ActionsResponseModel>(this.URL + `SupplierManagement/EditSupplierItem?merchantItemId=${itemId}`, model)
  }

  DeleteSupplierItem(itemId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `SupplierManagement/DeleteSupplierItem?merchantItemId=${itemId}`);
  }
  ChangeSupplierItemActiveStatus(merchantItemId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'SupplierManagement/ChangeSupplierItemActiveStatus?merchantItemId=' + merchantItemId);
  }
  SupplierItemQuickUpdate(merchantItemId: number, Price: number, UnitId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `SupplierManagement/SupplierItemQuickUpdate?merchantItemId=${merchantItemId}&Price=${Price}&UnitId=${UnitId}`);
  }
  ExportSupplierItems(searchModel: PagedResponseModel, categoryId: number) {
    return this.http.post<ActionsResponseModel>(this.URL + `SupplierManagement/ExportSupplierItems?CategoryId=${categoryId} `, searchModel);
  }




  //----------------------------------- Payment Receipt ------------------------------------------//

  GetPaymentReceipts_Data(model: PagedResponseModel<PaymentReceiptModel[]>) {
    return this.http.post<PagedResponseModel<PaymentReceiptModel[]>>(this.URL + 'PaymentReceipt/GetPaymentReceipts_Data', model);
  }

  GetPaymentReceipts_Filters(model: PagedResponseModel<PaymentReceiptModel[]>) {
    return this.http.post<FilterModel[]>(this.URL + 'PaymentReceipt/GetPaymentReceipts_Filters', model);
  }
  GetPaymentReceiptDetailsById(paymentReceiptId: number) {
    return this.http.get<PaymentReceiptModel>(this.URL + `PaymentReceipt/GetPaymentReceiptDetailsById?PaymentReceiptId=${paymentReceiptId}`);
  }
  SaveNewPaymentReceipt(model: PaymentReceiptModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'PaymentReceipt/SaveNewPaymentReceipt', model);
  }
  EditPaymentReceipt(paymentReceiptId: number, model: PaymentReceiptModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `PaymentReceipt/EditPaymentReceipt?PaymentReceiptId=${paymentReceiptId}`, model);
  }
  CancelPaymentReceipt(paymentReceiptId: any) {
    return this.http.get<ActionsResponseModel>(this.URL + 'PaymentReceipt/CancelPaymentReceipt?PaymentReceiptId=' + paymentReceiptId);
  }



   //-------------------------------------  Order ----------------------------------
    GetOrders_Data(model: PagedResponseModel) {
      return this.http.post<PagedResponseModel<WebsiteOrderModel[]>>(this.URL + 'SupplierManagement/GetOrders_Data', model);
    }
    GetOrders_Filters(model: PagedResponseModel<any[]>) {
      return this.http.post<FilterItem[]>(this.URL + 'SupplierManagement/GetOrders_Filters', model);
    }

}
