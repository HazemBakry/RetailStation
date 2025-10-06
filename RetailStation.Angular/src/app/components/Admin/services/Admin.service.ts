import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { SubscriberApplicationModel, SubscriberModel } from '../models/Subscriber';
import { AddUserRoleModel, RoleModel } from '../../Shared/models/RoleModel';
import { UserModel } from '../../Shared/models/UserModel';
import { BranchModel } from '../../Shared/models/BranchModel';
import { ItemCategoryModel } from '../models/Operation/itemCategory';
import { CategorySortModel } from '../models/Operation/categorySort';
import { UnitModel } from '../models/Operation/UnitModel';
import { SupplierModel } from '../models/Operation/SupplierModel';
import { ItemModel } from '../models/Operation/ItemModel';
import { PagedResponseModel } from '../../Shared/models/PagedResponseDTO';
import { SupplierItemModel } from '../../Main/models/SupplierItemModel';
import { SliderModel } from '../models/Operation/SliderModel';
import { PromotionModel } from '../models/Operation/PromotionModel';


@Injectable({
  providedIn: 'root',
})
export class AdminService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }


  //////////////////////////// Slider /////////////////////////////////////

  GetSlidersData(searchModel: any) {
    return this.http.post<PagedResponseModel<SliderModel[]>>(
      this.URL + 'Admin/GetSlidersData',
      searchModel
    );
  }

  GetSliderById(sliderId: number) {
    return this.http.get<SliderModel>(
      this.URL + `Admin/GetSliderById?SliderId=${sliderId}`
    );
  }

  AddSlider(model: FormData) {
    return this.http.post<ActionsResponseModel>(
      this.URL + 'Admin/AddSlider',
      model
    );
  }

  EditSlider(sliderId: number, model: FormData) {
    return this.http.post<ActionsResponseModel>(
      this.URL + `Admin/EditSlider?SliderId=${sliderId}`,
      model
    );
  }

  DeleteSlider(sliderId: number) {
    return this.http.get<ActionsResponseModel>(
      this.URL + `Admin/DeleteSlider?SliderId=${sliderId}`
    );
  }

  ChangeSliderActiveStatus(sliderId: number) {
    return this.http.get<ActionsResponseModel>(
      this.URL + `Admin/ChangeSliderActiveStatus?SliderId=${sliderId}`
    );
  }

  //////////////////////////// Promotions /////////////////////////////////////

  GetPromotionsData(searchModel: PagedResponseModel<PromotionModel[]>) {
    return this.http.post<PagedResponseModel<PromotionModel[]>>(
      this.URL + 'Admin/GetPromotionsData',
      searchModel
    );
  }

  GetPromotionDetailsById(promotionId: number) {
    return this.http.get<PromotionModel>(
      this.URL + `Admin/GetPromotionDetailsById?PromotionId=${promotionId}`
    );
  }

  AddNewPromotion(model: FormData) {
    return this.http.post<ActionsResponseModel>(
      this.URL + 'Admin/AddNewPromotion',
      model
    );
  }

  EditPromotion(promotionId: number, model: FormData) {
    return this.http.post<ActionsResponseModel>(
      this.URL + `Admin/EditPromotion?PromotionId=${promotionId}`,
      model
    );
  }

  DeletePromotion(promotionId: number) {
    return this.http.get<ActionsResponseModel>(
      this.URL + `Admin/DeletePromotion?PromotionId=${promotionId}`
    );
  }

  ChangePromotionActiveStatus(promotionId: number) {
    return this.http.get<ActionsResponseModel>(
      this.URL + `Admin/ChangePromotionActiveStatus?PromotionId=${promotionId}`
    );
  }

}
