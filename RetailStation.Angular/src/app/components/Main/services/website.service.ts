import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { PagedResponseModel } from '../../Shared/models/PagedResponseDTO';
import { SupplierItemModel } from '../models/SupplierItemModel';
import { WebsiteSliderModel } from '../models/WebsiteSliderModel';
import { FilterModel } from '../../Shared/models/FilterModel';
import { SubscribeRequestModel } from '../../Admin/models/SubscribeRequestModel';


@Injectable({
  providedIn: 'root',
})
export class WebsiteService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }



  /////////////////////////////// SupplierItems ////////////////////////

  GetWebsiteItems_Data(searchModel: PagedResponseModel<SupplierItemModel[]>) {
    return this.http.post<PagedResponseModel<SupplierItemModel[]>>(this.URL + 'Website/GetWebsiteItems_Data', searchModel);
  }
  GetWebsiteItems_Filters(searchModel: PagedResponseModel<SupplierItemModel[]>) {
    return this.http.post<FilterModel[]>(this.URL + 'Website/GetWebsiteItems_Filters', searchModel);
  }
  GetWebsitePromotionItems(searchModel: PagedResponseModel<SupplierItemModel[]>) {
    return this.http.post<PagedResponseModel<SupplierItemModel[]>>(this.URL + 'Website/GetWebsitePromotionItems', searchModel);
  }
  GetWebsiteMainSlider() {
    return this.http.get<WebsiteSliderModel[]>(this.URL + 'Website/GetWebsiteMainSlider');
  }

  GetWebsiteItemDetailsById(itemId: number) {
    return this.http.get<SupplierItemModel>(this.URL + `Website/GetWebsiteItemDetailsById?SupplierItemId=${itemId}`);
  }




  //////////////////////  SubscribeRequest
    SaveNewSubscribeRequest(model: SubscribeRequestModel) {
      return this.http.post<ActionsResponseModel>(this.URL + 'Auth/SubscribeRequest', model);
    }
}
