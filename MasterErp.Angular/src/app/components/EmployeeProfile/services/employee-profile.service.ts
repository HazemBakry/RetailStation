import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PagedResponseDTO } from '../../Shared/models/PagedResponseDTO';
import { EmployeeVacationModel } from '../../HR/models/EmployeeVacationModel';
import { ActionsResponseModel } from '../../Shared/models/CreateModifyReturnsModel';
import { FormDropdownModel } from '../../Shared/components/drop-down-form-control/drop-down-form-control.component';
import { SearchFilterModel } from '../../Shared/models/FilterModel';
import { EmployeeLoanModel } from '../../HR/models/EmployeeLoanModel';

@Injectable({
  providedIn: 'root'
})
export class EmployeeProfileService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }


  //================================== Vacation ===============================

  GetVacations(model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<EmployeeVacationModel[]>>(this.URL + 'EmployeeProfile/GetVacations', model);
  }
  AddNewVacation(model: EmployeeVacationModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'EmployeeProfile/AddNewVacation', model);
  }
  EditVacation(model: EmployeeVacationModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'EmployeeProfile/EditVacation', model);
  }

  DeleteVacation(VacationId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'EmployeeProfile/DeleteVacation?VacationId=' + VacationId);
  }



  //================================== Loans ===============================
  GetLoans(model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<EmployeeLoanModel[]>>(this.URL + 'EmployeeProfile/GetLoans', model);
  }
  AddNewLoan(model: EmployeeLoanModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'EmployeeProfile/AddNewLoan', model);
  }
  EditLoan(model: EmployeeLoanModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'EmployeeProfile/EditLoan', model);
  }
  DeleteLoan(loanId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'EmployeeProfile/DeleteLoan?LoanId=' + loanId);
  }
}
