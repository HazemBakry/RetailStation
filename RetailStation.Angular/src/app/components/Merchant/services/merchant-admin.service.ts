import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { PagedResponseDTO, PagedResponseModel } from '../../Shared/models/PagedResponseDTO';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { PurchaseReturnsModel } from '../../Purchases/models/PurchaseReturns';
import { GeneralOrderDetailsModel } from '../../Inventory/models/GeneralOrderModel ';
import { MerchantOrderModel } from '../models/MerchantOrderModel';
import { MerchantModel } from '../../Admin/models/MerchantModel';

@Injectable({
  providedIn: 'root'
})
export class MerchantAdminService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  GetSalesInvoicesData(model: FilterModel) {
    return this.http.post<any[]>(this.URL + 'SalesInvoice/GetSalesInvoicesData', model);
  }

  CreateNewSalesInvoice(model: MerchantOrderModel) {
    return this.http.post<any>(this.URL + 'SalesInvoice/CreateNewSalesInvoice', model);
  }


  //--------------------------------------- Merchants ---------------------------------------

  GetMerchants_Data(model: PagedResponseModel<MerchantModel[]>) {
    return this.http.post<PagedResponseModel<MerchantModel[]>>(this.URL + 'Merchants/GetMerchants_Data', model);
  }

  GetMerchantDetailsById(MerchantId: number) {
    return this.http.get<MerchantModel>(this.URL + 'Merchants/GetMerchantDetailsById?MerchantId=' + MerchantId);
  }

  CreateNewMerchant(model: MerchantModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Merchants/AddNewMerchant', model);
  }

  EditMerchant(MerchantId: number, model: MerchantModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Merchants/EditMerchant?MerchantId=' + MerchantId, model);
  }

  DeleteMerchant(MerchantId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Merchants/DeleteMerchant?MerchantId=' + MerchantId);
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



  MapMerchantItem(MerchantId: number, merchantItemId: number, itemId: number) {
    const params = new URLSearchParams();
    params.append('MerchantId', MerchantId.toString());
    params.append('merchantItemId', merchantItemId.toString());
    if (itemId !== null) {
      params.append('ItemId', itemId.toString());
    }

    const queryString = params.toString();
    return this.http.get<ActionsResponseModel>(this.URL + `MerchantManagement/MapMerchantItem?${queryString}`);

  }
  MarkItemAsBestSeller(merchantItemId: number) {
    const params = new URLSearchParams();
    params.append('merchantItemId', merchantItemId.toString());

    const queryString = params.toString();
    return this.http.get<ActionsResponseModel>(this.URL + `MerchantManagement/MarkItemAsBestSeller?${queryString}`);

  }

}