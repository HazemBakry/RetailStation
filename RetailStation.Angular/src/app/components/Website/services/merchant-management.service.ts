import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { PaymentReceiptModel } from '../../Shared/models/PaymentReceiptModel';
import { FilterItem, FilterModel } from '../../Shared/models/FilterModel';
import { WebsiteOrderItemModel, WebsiteOrderModel } from '../models/WebsiteOrderModel ';
import { PagedResponseModel } from '../../Shared/models/PagedResponseDTO';
import { MerchantModel } from '../../Admin/models/Operation/MerchantModel';
import { MerchantItemModel } from '../../Shared/models/MerchantItemModel';
import { BranchModel } from '../../Shared/models/BranchModel';


@Injectable({
  providedIn: 'root',
})
export class MerchantManagementService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  GetMerchantItems_Data(merchantId: number, searchModel: PagedResponseModel<MerchantItemModel[]>) {
    return this.http.post<PagedResponseModel<MerchantItemModel[]>>(this.URL + `MerchantManagement/GetMerchantItems_Data?MerchantId=${merchantId}`, searchModel);
  }
  
  MapMerchantItem(merchantId: number, merchantItemId: number, itemId: number) {
    const params = new URLSearchParams();
    params.append('MerchantId', merchantId.toString());
    params.append('MerchantItemId', merchantItemId.toString());
    if (itemId !== null) {
      params.append('ItemId', itemId.toString());
    }

    const queryString = params.toString();
    return this.http.get<ActionsResponseModel>(this.URL + `MerchantManagement/MapMerchantItem?${queryString}`);

  }
  MarkItemAsBestSeller(merchantItemId: number) {
    const params = new URLSearchParams();
    params.append('MerchantItemId', merchantItemId.toString());

    const queryString = params.toString();
    return this.http.get<ActionsResponseModel>(this.URL + `MerchantManagement/MarkItemAsBestSeller?${queryString}`);

  }


  /////////////////////////// Branches ////////////////////////

  GetBranches_Data(searchModel: any) {
    return this.http.post<PagedResponseModel<BranchModel[]>>(
      this.URL + 'MerchantManagement/GetBranches_Data',
      searchModel
    );
  }

  GetBranchById(branchId: number) {
    return this.http.get<BranchModel>(
      this.URL + `MerchantManagement/GetBranchById?BranchId=${branchId}`
    );
  }

  AddBranch(model: FormData) {
    return this.http.post<ActionsResponseModel>(
      this.URL + 'MerchantManagement/AddBranch',
      model
    );
  }

  EditBranch(branchId: number, model: FormData) {
    return this.http.post<ActionsResponseModel>(
      this.URL + `MerchantManagement/EditBranch?BranchId=${branchId}`,
      model
    );
  }

  DeleteBranch(branchId: number) {
    return this.http.get<ActionsResponseModel>(
      this.URL + `MerchantManagement/DeleteBranch?BranchId=${branchId}`
    );
  }

  ChangeBranchActiveStatus(branchId: number) {
    return this.http.get<ActionsResponseModel>(
      this.URL + `MerchantManagement/ChangeBranchActiveStatus?BranchId=${branchId}`
    );
  }
}
