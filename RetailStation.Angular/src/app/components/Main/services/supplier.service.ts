import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { PagedResponseModel } from '../../Shared/models/PagedResponseDTO';
import { SupplierItemModel } from '../models/SupplierItemModel';
import { PaymentReceiptModel } from '../models/PaymentReceiptModel';
import { FilterModel } from '../../Shared/models/FilterModel';


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
    return this.http.post<PagedResponseModel<PaymentReceiptModel[]>>(this.URL + 'PaymentReceipts/GetPaymentReceipts_Data', model);
  }

  GetPaymentReceipts_Filters(model: PagedResponseModel<PaymentReceiptModel[]>) {
    return this.http.post<FilterModel[]>(this.URL + 'PaymentReceipts/GetPaymentReceipts_Filters', model);
  }
  GetPaymentReceiptDetailsById(paymentReceiptId: number) {
    return this.http.get<PaymentReceiptModel>(this.URL + `PaymentReceipts/GetPaymentReceiptDetailsById?PaymentReceiptId=${paymentReceiptId}`);
  }
  SaveNewPaymentReceipt(model: PaymentReceiptModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'PaymentReceipts/SaveNewPaymentReceipt', model);
  }
  EditPaymentReceipt(paymentReceiptId: number, model: PaymentReceiptModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `PaymentReceipts/EditPaymentReceipt?PaymentReceiptId=${paymentReceiptId}`, model);
  }
  CancelPaymentReceipt(paymentReceiptId: any) {
    return this.http.get<ActionsResponseModel>(this.URL + 'PaymentReceipts/CancelPaymentReceipt?PaymentReceiptId=' + paymentReceiptId);
  }
}
