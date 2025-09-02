import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SalesInvoiceModel } from '../models/SalesInvoiceModel';
import { FilterModel } from 'src/app/components/Shared/models/FilterModel';
import { PagedResponseDTO } from '../../Shared/models/PagedResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  GetSalesInvoicesData(model:FilterModel) {
    return this.http.post<any[]>(this.URL + 'SalesInvoice/GetSalesInvoicesData',model);
  }

  CreateNewSalesInvoice(model: SalesInvoiceModel) {
    return this.http.post<any>(this.URL + 'SalesInvoice/CreateNewSalesInvoice', model);
  }
}
