import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { PagedResponseModel } from '../../Shared/models/PagedResponseDTO';
import { SupplierItemModel } from '../models/SupplierItemModel';


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
    return this.http.post<PagedResponseModel<SupplierItemModel[]>>(this.URL + 'Website/GetWebsiteItems_Filters', searchModel);
  }

  GetWebsiteItemDetailsById(itemId: number) {
    return this.http.get<SupplierItemModel>(this.URL + `Website/GetWebsiteItemDetailsById?SupplierItemId=${itemId}`);
  }

}
