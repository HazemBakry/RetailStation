import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FilterModel } from '../../Shared/models/FilterModel';
import { PagedResponseDTO } from '../../Shared/models/PagedResponseDTO';
import { PaymentTermDetailsModel, PaymentTermModel } from '../models/GeneralAccounts/PaymentTermModel';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { TaxCalculationModel } from '../models/GeneralAccounts/TaxCalculationModel';
import { DailyNotebookModel } from '../models/GeneralAccounts/DailyNotebookModel';

@Injectable({
  providedIn: 'root'
})
export class GeneralAccountSettingsService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  //================================== PaymentTerm ===============================

  GetPaymentTermsData(model: PagedResponseDTO<PaymentTermModel[]>) {
    return this.http.post<PagedResponseDTO<PaymentTermModel[]>>(this.URL + 'PaymentTerm/GetPaymentTermsData', model);
  }

  GetPaymentTermDetailsById(PaymentTermId: number) {
    return this.http.get<PaymentTermDetailsModel[]>(this.URL + 'PaymentTerm/GetPaymentTermDetailsById?PaymentTermId=' + PaymentTermId);
  }

  ChangePaymentTermStatus(PaymentTermId: number, IsActive: boolean) {
    return this.http.get<ActionsResponseModel>(this.URL + `PaymentTerm/ChangePaymentTermStatus?PaymentTermId=${PaymentTermId}&IsActive=${IsActive}`);
  }

  CreateNewPaymentTerm(Model: PaymentTermModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'PaymentTerm/CreateNewPaymentTerm', Model);
  }

  CreateNewPaymentTermDetails(paymentTermId:number,Model: PaymentTermDetailsModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `PaymentTerm/CreateNewPaymentTermDetails?PaymentTermId=${paymentTermId}`, Model);
  }

  EditPaymentTerm(paymentTermId:number,Model: PaymentTermModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `PaymentTerm/EditPaymentTerm?PaymentTermId=${paymentTermId}`, Model);
  }

  EditPaymentTermDetails(paymentTermDetailsId:number,Model: PaymentTermDetailsModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `PaymentTerm/EditPaymentTermDetails?PaymentTermDetailsId=${paymentTermDetailsId}`, Model);
  }

  DeletePaymentTerm(PaymentTermId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'PaymentTerm/DeletePaymentTerm?PaymentTermId=' + PaymentTermId);
  }

  DeletePaymentTermDetails(PaymentTermDetailsId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'PaymentTerm/DeletePaymentTermDetails?PaymentTermDetailsId=' + PaymentTermDetailsId);
  }

  //================================== TaxCalculation ===============================

  GetTaxCalculationsData(model: PagedResponseDTO<TaxCalculationModel[]>) {
    return this.http.post<PagedResponseDTO<TaxCalculationModel[]>>(this.URL + 'TaxCalculation/GetTaxCalculationsData', model);
  }

  ChangeTaxCalculationStatus(TaxCalculationId: number, IsActive: boolean) {
    return this.http.get<ActionsResponseModel>(this.URL + 'TaxCalculation/ChangeTaxCalculationStatus?TaxCalculationId=' + TaxCalculationId + '&IsActive=' + IsActive);
  }

  CreateNewTaxCalculation(Model: TaxCalculationModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'TaxCalculation/CreateNewTaxCalculation', Model);
  }

  EditTaxCalculation(taxCalculationId:number,Model: TaxCalculationModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `TaxCalculation/EditTaxCalculation?TaxCalculationId=${taxCalculationId}`, Model);
  }

  DeleteTaxCalculation(TaxCalculationId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'TaxCalculation/DeleteTaxCalculation?TaxCalculationId=' + TaxCalculationId);
  }

  //================================== DailyNotebook ===============================


  GetDailyNotebooksData(model: PagedResponseDTO<DailyNotebookModel[]>) {
    return this.http.post<PagedResponseDTO<DailyNotebookModel[]>>(this.URL + 'DailyNotebook/GetDailyNotebooksData', model);
  }

  CreateNewDailyNotebook(Model: DailyNotebookModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'DailyNotebook/CreateNewDailyNotebook', Model);
  }

  EditDailyNotebook(DailyNotebookId:number,Model: DailyNotebookModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `DailyNotebook/EditDailyNotebook?DailyNotebookId=${DailyNotebookId}`, Model);
  }

  DeleteDailyNotebook(DailyNotebookId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'DailyNotebook/DeleteDailyNotebook?DailyNotebookId=' + DailyNotebookId);
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
