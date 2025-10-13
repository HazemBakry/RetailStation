import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { SupplierItemModel } from '../models/SupplierItemModel';
import { PaymentReceiptModel } from '../models/PaymentReceiptModel';
import { FilterItem, FilterModel } from '../../Shared/models/FilterModel';
import { WebsiteOrderItemModel, WebsiteOrderModel } from '../models/WebsiteOrderModel ';
import { PagedResponseModel } from '../../Shared/models/PagedResponseDTO';


@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }



  /////////////////////////////// SupplierItems ////////////////////////

  GetSupplierItemsData(searchModel: PagedResponseModel<SupplierItemModel[]>) {
    return this.http.post<PagedResponseModel<SupplierItemModel[]>>(this.URL + 'SupplierManagement/GetSupplierItemsData', searchModel);
  }

  GetSupplierItemDetailsById(itemId: number) {
    return this.http.get<SupplierItemModel>(this.URL + `SupplierManagement/GetSupplierItemDetailsById?SupplierItemId=${itemId}`);
  }

  AddNewSupplierItem(model: FormData) {
    return this.http.post<ActionsResponseModel>(this.URL + 'SupplierManagement/AddNewSupplierItem', model);
  }
  ImportSupplierItemsFile(importerName:string,file: FormData) {
    return this.http.post<ActionsResponseModel>(this.URL + 'SupplierManagement/ImportSupplierItemsFile?ImporterName='+importerName, file);
  }

  EditSupplierItem(itemId: number, model: FormData) {
    return this.http.post<ActionsResponseModel>(this.URL + `SupplierManagement/EditSupplierItem?SupplierItemId=${itemId}`, model)
  }

  DeleteSupplierItem(itemId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `SupplierManagement/DeleteSupplierItem?SupplierItemId=${itemId}`);
  }
  ChangeSupplierItemActiveStatus(SupplierItemId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'SupplierManagement/ChangeSupplierItemActiveStatus?SupplierItemId=' + SupplierItemId);
  }
  SupplierItemQuickUpdate(SupplierItemId: number, Price: number, UnitId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `SupplierManagement/SupplierItemQuickUpdate?SupplierItemId=${SupplierItemId}&Price=${Price}&UnitId=${UnitId}`);
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
      return this.http.post<PagedResponseModel<WebsiteOrderModel[]>>(this.URL + 'Order/GetOrders_Data', model);
    }
    GetOrders_Filters(model: PagedResponseModel<any[]>) {
      return this.http.post<FilterItem[]>(this.URL + 'Order/GetOrders_Filters', model);
    }
    GetOrderDetailsById(OrderId: number) {
      return this.http.get<WebsiteOrderModel>(this.URL + 'Order/GetOrderDetailsById?OrderId=' + OrderId);
    }
    GetOrder_Items(OrderId: number) {
      return this.http.get<WebsiteOrderItemModel[]>(this.URL + `Order/GetOrder_Items?OrderId=${OrderId}`);
    }
    AddNewOrder(model: WebsiteOrderModel) {
      return this.http.post<ActionsResponseModel>(this.URL + 'Order/AddNewOrder', model);
    }
    EditOrder(OrderId:number,model: WebsiteOrderModel) {
      return this.http.post<ActionsResponseModel>(this.URL + 'Order/EditOrder?OrderId=' + OrderId, model);
    }
    CancelOrder(OrderId: number) {
      return this.http.get<ActionsResponseModel>(this.URL + 'Order/CancelOrder?OrderId=' + OrderId);
    }
}
