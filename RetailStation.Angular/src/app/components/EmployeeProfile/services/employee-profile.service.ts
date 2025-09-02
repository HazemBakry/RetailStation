import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PagedResponseDTO } from '../../Shared/models/PagedResponseDTO';
import { EmployeeVacationModel } from '../../HR/models/EmployeeVacationModel';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { FormDropdownModel } from '../../Shared/components/drop-down-form-control/drop-down-form-control.component';
import { SearchFilterModel } from '../../Shared/models/FilterModel';
import { EmployeeLoanModel } from '../../HR/models/EmployeeLoanModel';
import { EmployeeBasicInfoModel } from '../models/EmployeeBasicInfoModel';

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
  GetTeamWorkVacations(model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<EmployeeVacationModel[]>>(this.URL + 'EmployeeProfile/GetTeamWorkVacations', model);
  }
  ApproveVacation(VacationId: number,employeeId: number,approveStatus:boolean){
    return this.http.get<ActionsResponseModel>(this.URL + `EmployeeProfile/ApproveVacation?VacationId=${VacationId}&&EmployeeId=${employeeId}&ApproveStatus=${approveStatus}`);
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
  GetTeamWorkLoans(model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<EmployeeLoanModel[]>>(this.URL + 'EmployeeProfile/GetTeamWorkLoans', model);
  }
  ApproveLoan(loanId: number,employeeId: number,approveStatus:boolean) {
    return this.http.get<ActionsResponseModel>(this.URL + `EmployeeProfile/ApproveLoan?LoanId=${loanId}&EmployeeId=${employeeId}&ApproveStatus=${approveStatus}`);
  }


  //================================== Management ===============================

  GetTeamWork(model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<EmployeeBasicInfoModel[]>>(this.URL + 'EmployeeProfile/GetTeamWork', model);
  }




}
