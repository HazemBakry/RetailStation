import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SupplierModel } from '../models/SupplierModel';
import { ActionsResponseModel } from '../../Shared/models/CreateModifyReturnsModel';


@Injectable({
  providedIn: 'root'
})
export class SuppliersService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  //--------------------------------------- Suppliers ---------------------------------------

  GetSuppliersData() {
    return this.http.get<SupplierModel[]>(this.URL + 'Suppliers/GetSuppliersData');
  }
  GetSupplierById(supplierId:number) {
    return this.http.get<SupplierModel>(this.URL + `Suppliers/GetSupplierById?SupplierId=${supplierId}`);
  }
  AddNewSupplier(model: SupplierModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Suppliers/AddNewSupplier', model);
  }

  EditSupplier(supplierId:number,model: SupplierModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Suppliers/EditSupplier?SupplierId=${supplierId}`, model);
  }

  DeleteSupplier(supplierId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `Supplier/DeleteSupplier?SupplierId=${supplierId}`);
  }
}
