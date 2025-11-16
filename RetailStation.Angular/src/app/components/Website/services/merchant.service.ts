import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { PaymentReceiptModel } from '../../Shared/models/PaymentReceiptModel';
import { FilterItem, FilterModel } from '../../Shared/models/FilterModel';
import { WebsiteOrderItemModel, WebsiteOrderModel } from '../models/WebsiteOrderModel ';
import { PagedResponseModel } from '../../Shared/models/PagedResponseDTO';
import { MerchantModel } from '../../Admin/models/MerchantModel';
import { MerchantItemModel } from '../../Shared/models/MerchantItemModel';
import { BranchModel } from '../../Shared/models/BranchModel';
import { PromotionModel } from '../../Shared/models/PromotionModel';


@Injectable({
  providedIn: 'root',
})
export class MerchantService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }


  //--------------------------------------- Merchants ---------------------------------------

  GetMerchants_Data(model: PagedResponseModel<MerchantModel[]>) {
    return this.http.post<PagedResponseModel<MerchantModel[]>>(this.URL + 'Merchants/GetMerchants_Data', model);
  }

  GetMerchantDetailsById(merchantId: number) {
    return this.http.get<MerchantModel>(this.URL + 'Merchants/GetMerchantDetailsById?MerchantId=' + merchantId);
  }

  GetLoggedMerchantDetails() {
    return this.http.get<MerchantModel>(this.URL + 'Merchants/GetLoggedMerchantDetails');
  }

  CreateNewMerchant(model: MerchantModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Merchants/AddNewMerchant', model);
  }

  // EditMerchant(merchantId: number, model: MerchantModel) {
  //   return this.http.post<ActionsResponseModel>(this.URL + 'Merchants/EditMerchant?MerchantId=' + merchantId, model);
  // }

  EditMerchant(model: FormData) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Merchants/EditMerchant', model);
  }

  DeleteMerchant(merchantId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Merchants/DeleteMerchant?MerchantId=' + merchantId);
  }



  /////////////////////////////// MerchantItems ////////////////////////

  GetMerchantItems_Data(searchModel: PagedResponseModel<MerchantItemModel[]>) {
    return this.http.post<PagedResponseModel<MerchantItemModel[]>>(this.URL + 'MerchantManagement/GetMerchantItems_Data', searchModel);
  }

  GetMerchantItems_Filters(model: PagedResponseModel<any[]>) {
    return this.http.post<FilterItem[]>(this.URL + 'MerchantManagement/GetMerchantItems_Filters', model);
  }

  GetMerchantItemDetailsById(itemId: number) {
    return this.http.get<MerchantItemModel>(this.URL + `MerchantManagement/GetMerchantItemDetailsById?MerchantItemId=${itemId}`);
  }

  AddNewMerchantItem(model: FormData) {
    return this.http.post<ActionsResponseModel>(this.URL + 'MerchantManagement/AddNewMerchantItem', model);
  }
  ImportMerchantItemsFile(importerName: string, file: FormData) {
    return this.http.post<ActionsResponseModel>(this.URL + 'MerchantManagement/ImportMerchantItemsFile?ImporterName=' + importerName, file);
  }

  EditMerchantItem(itemId: number, model: FormData) {
    return this.http.post<ActionsResponseModel>(this.URL + `MerchantManagement/EditMerchantItem?MerchantItemId=${itemId}`, model)
  }

  DeleteMerchantItem(itemId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `MerchantManagement/DeleteMerchantItem?MerchantItemId=${itemId}`);
  }
  ChangeMerchantItemActiveStatus(MerchantItemId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'MerchantManagement/ChangeMerchantItemActiveStatus?MerchantItemId=' + MerchantItemId);
  }
  MerchantItemQuickUpdate(MerchantItemId: number, Price: number, UnitId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `MerchantManagement/MerchantItemQuickUpdate?MerchantItemId=${MerchantItemId}&Price=${Price}&UnitId=${UnitId}`);
  }
  ExportMerchantItems(searchModel: PagedResponseModel, categoryId: number) {
    return this.http.post<ActionsResponseModel>(this.URL + `MerchantManagement/ExportMerchantItems?CategoryId=${categoryId} `, searchModel);
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


  GetPromotions_Data(merchantId:number,searchModel: PagedResponseModel<PromotionModel[]>) {
    return this.http.post<PagedResponseModel<PromotionModel[]>>(
      this.URL + 'Merchants/GetPromotions_Data?MerchantId=' + merchantId,
      searchModel
    );
  }
  ApprovePromotionToDisplay(merchantId:number,PromotionId: number) {
    const params = new URLSearchParams();
    params.append('PromotionId', PromotionId.toString());
    params.append('MerchantId', merchantId.toString());
    const queryString = params.toString();
    return this.http.get<ActionsResponseModel>(this.URL + `Merchants/ApprovePromotionToDisplay?${queryString}`);

  }
}
