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

  GetDashboardItems_Data(searchModel: PagedResponseModel<SupplierItemModel[]>) {
    return this.http.post<PagedResponseModel<SupplierItemModel[]>>(this.URL + 'Dashboard/GetDashboardItems_Data', searchModel);
  }
  GetDashboardItems_Filters(searchModel: PagedResponseModel<SupplierItemModel[]>) {
    return this.http.post<PagedResponseModel<SupplierItemModel[]>>(this.URL + 'Dashboard/GetDashboardItems_Filters', searchModel);
  }

  GetDashboardItemDetailsById(itemId: number) {
    return this.http.get<SupplierItemModel>(this.URL + `Dashboard/GetDashboardItemDetailsById?SupplierItemId=${itemId}`);
  }

}
