import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SaveEmployeeModel } from 'src/app/Models/SaveEmployeeModel';

@Injectable({
  providedIn: 'root'
})
export class HrService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }
  //==================================Employees===============================
  GetIqamaIssuePlaceData() {
    return this.http.get<any>(this.URL + 'Employees/GetIqamaIssuePlaceData');
  }

  GetPassportIssuePlaceData() {
    return this.http.get<any>(this.URL + 'Employees/GetPassportIssuePlaceData');
  }

  GetSponsorData() {
    return this.http.get<any>(this.URL + 'Employees/GetSponsorData');
  }

  GetIqamaJobData() {
    return this.http.get<any>(this.URL + 'Employees/GetIqamaJobData');
  }

  GetNationalityData() {
    return this.http.get<any>(this.URL + 'Employees/GetNationalityData');
  }

  GetJobData() {
    return this.http.get<any>(this.URL + 'Employees/GetJobData');
  }

  GetBranchData() {
    return this.http.get<any>(this.URL + 'Employees/GetBranchData');
  }

  GetBankData() {
    return this.http.get<any>(this.URL + 'Employees/GetBankData');
  }

  AddNewEmployee(model: SaveEmployeeModel) {
    return this.http.post<any>(this.URL + 'Employees/AddNewEmployee', model);
  }
}
