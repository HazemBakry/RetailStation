import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SearchFilterModel } from '../../Shared/models/FilterModel';
import { EmployeeModel } from '../models/Employee/EmployeeModel';
import { EmployeeContractModel } from '../models/Employee/EmployeeContractModel';
import { EmployeeVerificationModel } from '../models/Employee/EmployeeVerificationModel';
import { EmployeeExtraDataModel } from '../models/Employee/EmployeeExtraDataModel';
import { ActionsResponseModel } from '../../Shared/models/CreateModifyReturnsModel';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }
  GetAllEmployees(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'Employee/GetAllEmployees', model);
  }

  CreateNewEmployee(model: EmployeeModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Employee/CreateNewEmployee', model);
  }

  EditEmployee(employeeId:number,model: EmployeeModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Employee/EditEmployee?EmployeeId=${employeeId}`, model);
  }

  SaveEmployeeContractData(employeeId:number,model: EmployeeContractModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Employee/SaveEmployeeContractData?EmployeeId=${employeeId}`, model);
  }

  SaveEmployeeVerificationData(employeeId:number,model: EmployeeVerificationModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Employee/SaveEmployeeVerificationData?EmployeeId=${employeeId}`, model);
  }

  SaveEmployeeExtraData(employeeId:number,model: EmployeeExtraDataModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Employee/SaveEmployeeExtraData?EmployeeId=${employeeId}`, model);
  }


  GetEmployeeBasicInfoById(employeeId:number) {
    return this.http.get<EmployeeModel>(this.URL + `Employee/GetEmployeeBasicInfoById?EmployeeId=${employeeId}`);
  }

  GetEmployeeContractInfoById(employeeId:number) {
    return this.http.get<EmployeeContractModel>(this.URL + `Employee/GetEmployeeContractInfoById?EmployeeId=${employeeId}`);
  }
  GetEmployeeVerificationInfoById(employeeId:number) {
    return this.http.get<EmployeeVerificationModel>(this.URL + `Employee/GetEmployeeVerificationInfoById?EmployeeId=${employeeId}`);
  }
  GetEmployeeExtraInfoById(employeeId:number) {
    return this.http.get<EmployeeExtraDataModel>(this.URL + `Employee/GetEmployeeExtraInfoById?EmployeeId=${employeeId}`);
  }


}
