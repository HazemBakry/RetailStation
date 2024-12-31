import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FilterModel } from '../../Shared/models/FilterModel';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  //================================== Customer ===============================

  GetCustomerData(model: FilterModel) {
    return this.http.post<any[]>(this.URL + 'Customer/GetCustomerData', model);
  }

  AddNewCustomer(Model: any) {
    return this.http.post<any>(this.URL + 'Customer/AddNewCustomer', Model);
  }

  EditCustomer(Model: any) {
    return this.http.post<any>(this.URL + 'Customer/EditCustomer', Model);
  }

  DeleteCustomer(CustomerId: number) {
    return this.http.get<any>(this.URL + 'Customer/DeleteCustomer?CustomerId=' + CustomerId);
  }

  //================================== Batch ===============================

  GetBatchData(model: FilterModel) {
    return this.http.post<any[]>(this.URL + 'Batch/GetBatchData', model);
  }

  AddNewBatch(Model: any) {
    return this.http.post<any>(this.URL + 'Batch/AddNewBatch', Model);
  }

  EditBatch(Model: any) {
    return this.http.post<any>(this.URL + 'Batch/EditBatch', Model);
  }

  DeleteBatch(BatchId: number) {
    return this.http.get<any>(this.URL + 'Batch/DeleteBatch?BatchId=' + BatchId);
  }
}
