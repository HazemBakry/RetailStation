import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FilterModel } from '../../Shared/models/FilterModel';

@Injectable({
  providedIn: 'root'
})
export class GeneralAccountSettingsService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  //================================== PaymentTerm ===============================

  GetPaymentTermsData() {
    return this.http.get<any[]>(this.URL + 'PaymentTerm/GetPaymentTermsData');
  }

  GetPaymentTermDetailsById(PaymentTermId: number) {
    return this.http.get<any[]>(this.URL + 'PaymentTerm/GetPaymentTermDetailsById?PaymentTermId=' + PaymentTermId);
  }

  ChangePaymentTermStatus(IsActive: boolean, PaymentTermId: number) {
    return this.http.get<any>(this.URL + 'PaymentTerm/ChangePaymentTermStatus?IsActive=' + IsActive + '&PaymentTermId=' + PaymentTermId);
  }

  AddNewPaymentTerm(Model: any) {
    return this.http.post<any>(this.URL + 'PaymentTerm/AddNewPaymentTerm', Model);
  }

  AddNewPaymentTermDetails(Model: any) {
    return this.http.post<any>(this.URL + 'PaymentTerm/AddNewPaymentTermDetails', Model);
  }

  EditPaymentTerm(Model: any) {
    return this.http.post<any>(this.URL + 'PaymentTerm/EditPaymentTerm', Model);
  }

  EditPaymentTermDetails(Model: any) {
    return this.http.post<any>(this.URL + 'PaymentTerm/EditPaymentTermDetails', Model);
  }

  DeletePaymentTerm(PaymentTermId: number) {
    return this.http.get<any>(this.URL + 'PaymentTerm/DeletePaymentTerm?PaymentTermId=' + PaymentTermId);
  }

  DeletePaymentTermDetails(PaymentTermDetailId: number) {
    return this.http.get<any>(this.URL + 'PaymentTerm/DeletePaymentTermDetails?PaymentTermDetailId=' + PaymentTermDetailId);
  }

  //================================== TaxCalculation ===============================

  GetTaxCalculationData(model: FilterModel) {
    return this.http.post<any[]>(this.URL + 'TaxCalculation/GetTaxCalculationData', model);
  }

  GetTaxLookups() {
    return this.http.get<any[]>(this.URL + 'TaxCalculation/GetTaxLookups');
  }

  ChangeTaxCalculationStatus(TaxCalculationId: number, IsActive: boolean) {
    return this.http.get<any>(this.URL + 'TaxCalculation/ChangeTaxCalculationStatus?TaxCalculationId=' + TaxCalculationId + '&IsActive=' + IsActive);
  }

  AddNewTaxCalculation(Model: any) {
    return this.http.post<any>(this.URL + 'TaxCalculation/AddNewTaxCalculation', Model);
  }

  EditTaxCalculation(Model: any) {
    return this.http.post<any>(this.URL + 'TaxCalculation/EditTaxCalculation', Model);
  }

  DeleteTaxCalculation(TaxCalculationId: number) {
    return this.http.get<any>(this.URL + 'TaxCalculation/DeleteTaxCalculation?TaxCalculationId=' + TaxCalculationId);
  }

  //================================== DailyNotebook ===============================

  GetDailyNotebookData(model: FilterModel) {
    return this.http.post<any[]>(this.URL + 'DailyNotebook/GetDailyNotebookData', model);
  }

  AddNewDailyNotebook(Model: any) {
    return this.http.post<any>(this.URL + 'DailyNotebook/AddNewDailyNotebook', Model);
  }

  EditDailyNotebook(Model: any) {
    return this.http.post<any>(this.URL + 'DailyNotebook/EditDailyNotebook', Model);
  }

  DeleteDailyNotebook(DailyNotebookId: number) {
    return this.http.get<any>(this.URL + 'DailyNotebook/DeleteDailyNotebook?DailyNotebookId=' + DailyNotebookId);
  }

  //================================== AssetsForm ===============================

  GetAssetsFormData(model: FilterModel) {
    return this.http.post<any[]>(this.URL + 'AssetsForm/GetAssetsFormData', model);
  }

  AddNewAssetsForm(Model: any) {
    return this.http.post<any>(this.URL + 'AssetsForm/AddNewAssetsForm', Model);
  }

  EditAssetsForm(Model: any) {
    return this.http.post<any>(this.URL + 'AssetsForm/EditAssetsForm', Model);
  }

  DeleteAssetsForm(AssetsFormId: number) {
    return this.http.get<any>(this.URL + 'AssetsForm/DeleteAssetsForm?AssetsFormId=' + AssetsFormId);
  }

  //================================== LedgerJournalType ===============================

  GetLedgerJournalTypeData() {
    return this.http.get<any[]>(this.URL + 'LedgerJournalType/GetLedgerJournalTypeData');
  }

  AddNewLedgerJournalType(Model: any) {
    return this.http.post<any>(this.URL + 'LedgerJournalType/AddNewLedgerJournalType', Model);
  }

  EditLedgerJournalType(Model: any) {
    return this.http.post<any>(this.URL + 'LedgerJournalType/EditLedgerJournalType', Model);
  }

  DeleteLedgerJournalType(Id: number) {
    return this.http.get<any>(this.URL + 'LedgerJournalType/DeleteLedgerJournalType?Id=' + Id);
  }
}
