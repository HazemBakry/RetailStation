import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GeneralSelectorModel } from '../components/general-selector/general-selector.component';
import { WorkflowStatusGroup } from '../Enums/FinanceWorkflowStatus';

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) {

  }

  // --------------------------------- Finance Lookups --------------------------------- //

  GetBanksSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Lookup/GetBanksSelector');
  }

  GetCurrencySelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Lookup/GetCurrencySelector');
  }

  GetAccountTypes() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Lookup/GetAccountTypes');
  }

  GetActionTypes() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Lookup/GetActionTypes');
  }

  GetBankDepositTypes() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Lookup/GetBankDepositTypes');
  }

  GetJournalEntryTypes() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Lookup/GetJournalEntryTypes');
  }

  GetLedgerTypes() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Lookup/GetLedgerTypes');
  }

  GetPaymentTypes() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Lookup/GetPaymentTypes');
  }
  GetPaymentMethods() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Lookup/GetPaymentMethods');
  }

  GetReceiptTypes(groupName: string, paymentTypeId: number) {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Lookup/GetReceiptTypes?GroupName=' + groupName + '&PaymentTypeId=' + paymentTypeId);
  }

  // --------------------------------- HR Lookups --------------------------------- //

  GetVacationTypesSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Lookup/GetVacationTypesSelector');
  }
  GetFinancialCustodyTypesSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Lookup/GetFinancialCustodyTypesSelector');
  }
  // GetEmployeeStatusSelector() {
  //   return this.http.get<GeneralSelectorModel[]>(this.URL + 'Lookup/GetEmployeeStatusSelector');
  // }

  GetLoanTypesSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Lookup/GetLoanTypesSelector');
  }

  GetNationalitiesSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Lookup/GetNationalitiesSelector');
  }

  GetWorkStatusSelector(group: WorkflowStatusGroup = WorkflowStatusGroup.All) {

    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Lookup/GetWorkStatusSelector?Group=' + group);
  }

  GetReligionsSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Lookup/GetReligionsSelector');
  }

  GetSocialStatusSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Lookup/GetSocialStatusSelector');
  }


  // --------------------------------- Global Lookups --------------------------------- //

  GetCountriesSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Lookup/GetCountriesSelector');
  }

  GetCitiesSelector(countryId: number = null) {
    const param = countryId !== null ? `?CountryId=${countryId}` : '';
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Lookup/GetCitiesSelector' + param);
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
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Lookup/GetRegionIdSelector' + (queryString ? `?${queryString}` : ''));

  }

  GetTaxLookupsSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Lookup/GetTaxLookups');
  }
  GetMaterialRequestPurposesSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Lookup/GetMaterialRequestPurposes');
  }
  GetEmployeeDueTypesSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Lookup/GetEmployeeDueTypesSelector');
  }
  GetSponsorTypesSelector() {
    return this.http.get<GeneralSelectorModel[]>(this.URL + 'Lookup/GetSponsorTypesSelector');
  }
}
