import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { PagedResponseModel } from '../../Shared/models/PagedResponseDTO';
import { SliderModel } from '../models/Operation/SliderModel';
import { Observable } from 'rxjs';
import { FilterModel } from '../../Shared/models/FilterModel';
import { Tag } from '../models/TagsManagerModels';
import { PromotionModel } from '../../Shared/models/PromotionModel';
import { CityModel, CountryModel, RegionModel } from '../models/Operation/CountryModel';


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


  
    // ================================== Notifications Manager ==================================
  
    GetNotifications(model: FilterModel) {
      return this.http.post<any>(this.URL + 'Notification/GetNotificationsBySubscriberID', model);
    }
  
    GetRecipientsByNotificationID(notificationID: number) {
      return this.http.get<any[]>(this.URL + 'Notification/GetRecipientsByNotificationID?notificationID=' + notificationID);
    }
  
    getCustomers(params: { search?: string, take?: number }): Observable<any[]> {
      const httpParams = new HttpParams({ fromObject: { ...params } });
      return this.http.get<any[]>(this.URL + 'Notification/GetCustomers', { params: httpParams });
    }
  
    SaveNotification(model: any) {
      return this.http.post<any>(this.URL + 'Notification/SaveNotification', model)
    }
  
    UpdateNotification(model: any) {
      return this.http.post<any>(this.URL + 'Notification/UpdateNotification', model)
    }
  
    UpdateNotificationIsActive(id: any, isActive: any) {
      return this.http.post<any>(this.URL + 'Notification/UpdateNotificationStatus?id=' + id, isActive)
    }
  
  
  
    // ================================== Tags Manager ==================================
  
  
    getTags() {
      return this.http.get<Tag[]>(this.URL + 'TagsManager/GetTags');
    }
  
    createTag(tag: Partial<Tag>) {
      const { name } = tag;
      return this.http.post<Tag>(this.URL + 'TagsManager/CreateTag', tag);
    }
  
    updateTag(tag: Tag) {
      return this.http.post(this.URL + `TagsManager/tags/${tag.tagId}`, tag);
    }
  
    deleteTag(tagId: number) {
      return this.http.post(this.URL + `TagsManager/DeleteTag/${tagId}`, {});
    }
  
    getAllItems() {
      return this.http.get<any[]>(this.URL + 'ItemTags/GetAllItems');
    }
  
    getItemsForTag(tagId: number) {
      return this.http.get<any[]>(this.URL + `ItemTags/tags/${tagId}/items`);
    }
  
    assignItemToTag(tagId: number, itemId: number) {
      return this.http.post(this.URL + `ItemTags/assign/${itemId}/${tagId}`, {});
    }
  
    unassignItemFromTag(tagId: number, itemId: number) {
      return this.http.post(this.URL + `ItemTags/unassign/${itemId}/${tagId}`, {});
    }
  
    updateIsActive(id: any, isActive: any) {
      return this.http.post<any>(this.URL + 'TagsManager/updateIsActive?id=' + id, isActive)
    }
  







  GetCountries_Data(model: PagedResponseModel<CountryModel[]>) {
    return this.http.post<PagedResponseModel<CountryModel[]>>(this.URL + 'SystemSetting/GetCountries_Data', model);
  }

  CreateNewCountry(model: CountryModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'SystemSetting/AddCountry', model);
  }

  EditCountry(unitId: number, model: CountryModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `SystemSetting/EditCountry?CountryId=${unitId}`, model);
  }

  DeleteCountry(unitId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `SystemSetting/DeleteCountry?CountryId=${unitId}`);
  }


  GetCities_Data(model: PagedResponseModel<CityModel[]>) {
    return this.http.post<PagedResponseModel<CityModel[]>>(this.URL + 'SystemSetting/GetCities_Data', model);
  }

  CreateNewCity(model: CityModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'SystemSetting/AddCity', model);
  }

  EditCity(unitId: number, model: CityModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `SystemSetting/EditCity?CityId=${unitId}`, model);
  }

  DeleteCity(unitId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `SystemSetting/DeleteCity?CityId=${unitId}`);
  }


  GetRegions_Data(model: PagedResponseModel<RegionModel[]>) {
    return this.http.post<PagedResponseModel<RegionModel[]>>(this.URL + 'SystemSetting/GetRegions_Data', model);
  }

  CreateNewRegion(model: RegionModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'SystemSetting/AddRegion', model);
  }

  EditRegion(unitId: number, model: RegionModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `SystemSetting/EditRegion?RegionId=${unitId}`, model);
  }

  DeleteRegion(unitId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `SystemSetting/DeleteRegion?RegionId=${unitId}`);
  }



}
