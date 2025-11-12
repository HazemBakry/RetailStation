import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { ExcelExportStyle } from '../Enums/ImporterTemplateEnum';
import { ActionsResponseModel } from '../models/ActionsResponseModel';
import { FormControl, FormGroup } from '@angular/forms';
import { GeneralSelectorModel } from '../components/general-selector/general-selector.component';
import { AccountTypeEnum } from '../Enums/AccountTypeEnum';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  taxPercent: number = 0.15;
  URL = environment.apiURL;

  constructor(private http: HttpClient) {

  }

  urlDownloadOrOpen(url?: string) {
    try {
      if (url !== null && url !== ' ' && url !== '') {
        window.location.href = url;
      } else {
      }
    } catch (error) {

    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  calculateTaxValue(totalAmount: number): number {
    var taxValue = 0;
    if (totalAmount && totalAmount > 0) {
      taxValue = totalAmount - (totalAmount / (1 + this.taxPercent));
    }
    return taxValue;
  }

  downloadImporterTemplate(template: ExcelExportStyle) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Shared/DownloadImporterTemplate?ImporterType=' + template);
  }

  GetBranchesSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetBranchesSelector');
  }

  GetSponsorsSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetSponsorsSelector');
  }

  GetDepartmentsSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetDepartmentsSelector');
  }

  GetOrderStatusSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetOrderStatusSelector');
  }

  GetStoresSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetStoresSelector');
  }

  GetMerchantsSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetMerchantsSelector');
  }

  GetItemsSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetItemsSelector');
  }
  
  GetCurrentMerchantItemsSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetCurrentMerchantItemsSelector');
  }
  GetMerchantItemsSelector(merchantId: number) {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetMerchantItemsSelector?MerchantId=' + merchantId);
  }

  GetItemCategoriesSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetItemCategoriesSelector');
  }

  GetUnitsSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetUnitsSelector');
  }

  GetChildAccountsSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetChildAccountsSelector');
  }

  GetItemLookupsSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetItemLookupsSelector');
  }

  GetBanksSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetBanksSelector');
  }


  GetRegionsSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetRegionsSelector');
  }

  GetCountriesSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetCountriesSelector');
  }

  GetCitiesSelector(countryId: number = null) {
    const param = countryId !== null ? `?CountryId=${countryId}` : '';
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetCitiesSelector' + param);
  }

  GetRegionIdSelector(countryId: number = null, cityId: number = null) {
    const params = new URLSearchParams();
    if (countryId !== null) {
      params.append('CountryId', countryId.toString());
    }
    if (cityId !== null) {
      params.append('CityId', cityId.toString());
    }
    const queryString = params.toString();
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Shared/GetRegionIdSelector' + (queryString ? `?${queryString}` : ''));
  }
  
}
