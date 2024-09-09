import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SaveEmployeeModel } from 'src/app/components/HR/models/SaveEmployeeModel';
import { SearchFilterModel } from '../../Shared/models/FilterModel';
import { FormDropdownModel } from '../../Shared/components/drop-down-form-control/drop-down-form-control.component';
import { EmployeeVacationModel } from '../models/EmployeeVacationModel';
import { PagedResponseDTO } from '../../Shared/models/PagedResponseDTO';
import { ActionsResponseModel } from '../../Shared/models/CreateModifyReturnsModel';
import { EmployeePenaltyModel } from '../models/EmployeePenaltyModel';
import { EmployeeOverTimeModel } from '../models/EmployeeOverTimeModel';
import { EmployeeSickLeaveModel } from '../models/EmployeeSickLeaveModel';
import { EmployeeDeductModel } from '../models/EmployeeDeductModel';
import { EmployeeCareerModel } from '../models/EmployeeCareerModel';
import { EmployeeLoanModel } from '../models/EmployeeLoanModel';

@Injectable({
  providedIn: 'root'
})
export class HrService {
  URL = environment.apiURL;

  constructor(private http: HttpClient) { }

  //================================== Employees ===============================

  GetAllEmployees(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'Employee/GetAllEmployees', model);
  }

  GetEmployeesSummary(){
    return this.http.get<any>(this.URL + 'Employee/GetEmployeesSummary');
  }

  GetActiveEmployeesSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Employee/GetActiveEmployeesSelector');
  }

  GetEmployeesFilter(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'Employee/GetEmployeesFilter', model);
  }

  GetEmployeeRequests_Data(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'Employee/GetEmployeeRequests_Data', model);
  }
  
  AddNewEmployee(model: any) {
    return this.http.post<any>(this.URL + 'Employee/AddNewEmployee', model);
  }

  EditEmployeeData(model: any) {
    return this.http.post<any>(this.URL + 'Employee/EditEmployeeData', model);
  }

  RemoveEmployee(EmployeeId: string) {
    return this.http.get<any>(this.URL + 'Employee/RemoveEmployee?employeeId=' + EmployeeId);
  }


  GetEmployeesSalaryByBranch() {
    return this.http.get<any>(this.URL + 'Employee/GetEmployeesSalaryByBranch');
  }

  GetIqamaIssuePlaces() {
    return this.http.get<any>(this.URL + 'Employee/GetIqamaIssuePlaces');
  }

  GetPassportIssuePlaces() {
    return this.http.get<any>(this.URL + 'Employee/GetPassportIssuePlaces');
  }

  GetSponsorData() {
    return this.http.get<any>(this.URL + 'Employee/GetSponsorData');
  }

  GetIqamaJobData() {
    return this.http.get<any>(this.URL + 'Employee/GetIqamaJobData');
  }

  GetNationalityData() {
    return this.http.get<any>(this.URL + 'Employee/GetNationalityData');
  }

  GetJobData() {
    return this.http.get<any>(this.URL + 'Employee/GetJobData');
  }

  GetBranchData() {
    return this.http.get<any>(this.URL + 'Branch/GetBranchesData');
  }

  GetBankData() {
    return this.http.get<any>(this.URL + 'Employee/GetBankData');
  }

  EditEmployeeSalary(model: any) {
    return this.http.post<any>(this.URL + 'Employee/EditEmployeeSalary', model);
  }



  //================================== Attendance ===============================

  GetAttendanceData() {
    return this.http.get<any>(this.URL + 'Attendance/GetAttendanceData');
  }

  AddNewAttendance(model: any) {
    return this.http.post<any>(this.URL + 'Attendance/AddNewAttendance', model);
  }

  EditAttendance(model: any) {
    return this.http.post<any>(this.URL + 'Attendance/EditAttendance', model);
  }

  DeleteAttendance(AttendanceId: number) {
    return this.http.get<any>(this.URL + 'Attendance/DeleteAttendance?AttendanceId=' + AttendanceId);
  }

  //================================== OverTime ===============================

  GetOverTimeData() {
    return this.http.get<any>(this.URL + 'OverTime/GetOverTimeData');
  }

  AddNewOverTime(model: any) {
    return this.http.post<any>(this.URL + 'OverTime/AddNewOverTime', model);
  }

  EditOverTime(model: any) {
    return this.http.post<any>(this.URL + 'OverTime/EditOverTime', model);
  }

  DeleteOverTime(OverTimeId: number) {
    return this.http.get<any>(this.URL + 'OverTime/DeleteOverTime?OverTimeId=' + OverTimeId);
  }

  //================================== Penalty ===============================

  GetPenaltyData() {
    return this.http.get<any>(this.URL + 'Penalty/GetPenaltyData');
  }

  AddNewPenalty(model: any) {
    return this.http.post<any>(this.URL + 'Penalty/AddNewPenalty', model);
  }

  EditPenalty(model: any) {
    return this.http.post<any>(this.URL + 'Penalty/EditPenalty', model);
  }

  DeletePenalty(PenaltyId: number) {
    return this.http.get<any>(this.URL + 'Penalty/DeletePenalty?PenaltyId=' + PenaltyId);
  }

  //================================== SickLeave ===============================

  GetSickLeaveData() {
    return this.http.get<any>(this.URL + 'SickLeave/GetSickLeaveData');
  }

  AddNewSickLeave(model: any) {
    return this.http.post<any>(this.URL + 'SickLeave/AddNewSickLeave', model);
  }

  EditSickLeave(model: any) {
    return this.http.post<any>(this.URL + 'SickLeave/EditSickLeave', model);
  }

  DeleteSickLeave(SickLeaveId: number) {
    return this.http.get<any>(this.URL + 'SickLeave/DeleteSickLeave?SickLeaveId=' + SickLeaveId);
  }

  //================================== Vacation ===============================

  GetAllEmployeeVacationsData(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'Vacation/GetAllEmployeeVacationsData', model);
  }
  GetVacationsByEmployeeId(employeeId,model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<EmployeeVacationModel[]>>(this.URL + 'Vacation/GetVacationsByEmployeeId?EmployeeId='+employeeId, model);
  }
  AddNewEmployeeVacation(employeeId:number,model: EmployeeVacationModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Vacation/AddNewEmployeeVacation?EmployeeId='+employeeId, model);
  }
  EditEmployeeVacation(employeeId:number,model: EmployeeVacationModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Vacation/EditEmployeeVacation?EmployeeId='+employeeId, model);
  }
  DeleteEmployeeVacation(VacationId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Vacation/DeleteEmployeeVacation?VacationId=' + VacationId);
  }
  //================================== OverTime ===============================
    GetAllEmployeeOverTimeData(model: SearchFilterModel) {
      return this.http.post<PagedResponseDTO<EmployeeOverTimeModel[]>>(this.URL + 'OverTime/GetAllEmployeeOverTimeData', model);
    }
    GetOverTimeByEmployeeId(employeeId,model: PagedResponseDTO) {
      return this.http.post<PagedResponseDTO<EmployeeOverTimeModel[]>>(this.URL + 'OverTime/GetOverTimeByEmployeeId?EmployeeId='+employeeId, model);
    }
    AddNewEmployeeOverTime(employeeId:number,model: EmployeeOverTimeModel) {
      return this.http.post<ActionsResponseModel>(this.URL + 'OverTime/AddNewEmployeeOverTime?EmployeeId='+employeeId, model);
    }
    EditEmployeeOverTime(employeeId:number,model: EmployeeOverTimeModel) {
      return this.http.post<ActionsResponseModel>(this.URL + 'OverTime/EditEmployeeOverTime?EmployeeId='+employeeId, model);
    }
    DeleteEmployeeOverTime(overTimeId: number) {
      return this.http.get<ActionsResponseModel>(this.URL + 'OverTime/DeleteEmployeeOverTime?OverTimeId=' + overTimeId);
    }

    //================================== Penalty ===============================

    GetAllEmployeePenaltiesData(model: SearchFilterModel) {
      return this.http.post<PagedResponseDTO<EmployeePenaltyModel[]>>(this.URL + 'Penalty/GetAllEmployeePenaltiesData', model);
    }
    GetPenaltiesByEmployeeId(employeeId,model: PagedResponseDTO) {
      return this.http.post<PagedResponseDTO<EmployeePenaltyModel[]>>(this.URL + 'Penalty/GetPenaltiesByEmployeeId?EmployeeId='+employeeId, model);
    }
    AddNewEmployeePenalty(employeeId:number,model: EmployeePenaltyModel) {
      return this.http.post<ActionsResponseModel>(this.URL + 'Penalty/AddNewEmployeePenalty?EmployeeId='+employeeId, model);
    }
    EditEmployeePenalty(employeeId:number,model: EmployeePenaltyModel) {
      return this.http.post<ActionsResponseModel>(this.URL + 'Penalty/EditEmployeePenalty?EmployeeId='+employeeId, model);
    }
    DeleteEmployeePenalty(PenaltyId: number) {
      return this.http.get<ActionsResponseModel>(this.URL + 'Penalty/DeleteEmployeePenalty?PenaltyId=' + PenaltyId);
    }
    GetPenaltyTypesSelector() {
      return this.http.get<FormDropdownModel[]>(this.URL + 'Penalty/GetPenaltyTypesSelector');
    }
  
  //================================== SickLeave ===============================
  GetAllEmployeeSickLeavesData(model: SearchFilterModel) {
    return this.http.post<PagedResponseDTO<EmployeeSickLeaveModel[]>>(this.URL + 'SickLeave/GetAllEmployeeSickLeavesData', model);
  }
  GetSickLeavesByEmployeeId(employeeId,model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<EmployeeSickLeaveModel[]>>(this.URL + 'SickLeave/GetSickLeavesByEmployeeId?EmployeeId='+employeeId, model);
  }
  AddNewEmployeeSickLeave(employeeId:number,model: EmployeeSickLeaveModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'SickLeave/AddNewEmployeeSickLeave?EmployeeId='+employeeId, model);
  }
  EditEmployeeSickLeave(employeeId:number,model: EmployeeSickLeaveModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'SickLeave/EditEmployeeSickLeave?EmployeeId='+employeeId, model);
  }
  DeleteEmployeeSickLeave(overTimeId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'SickLeave/DeleteEmployeeSickLeave?SickLeaveId=' + overTimeId);
  }



  
  //================================== Deducts ===============================
  GetAllEmployeeDeductsData(model: SearchFilterModel) {
    return this.http.post<PagedResponseDTO<EmployeeDeductModel[]>>(this.URL + 'Deducts/GetAllEmployeeDeductsData', model);
  }
  GetDeductsByEmployeeId(employeeId,model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<EmployeeDeductModel[]>>(this.URL + 'Deducts/GetDeductsByEmployeeId?EmployeeId='+employeeId, model);
  }
  AddNewEmployeeDeduct(employeeId:number,model: EmployeeDeductModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Deducts/AddNewEmployeeDeduct?EmployeeId='+employeeId, model);
  }
  EditEmployeeDeduct(employeeId:number,model: EmployeeDeductModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Deducts/EditEmployeeDeduct?EmployeeId='+employeeId, model);
  }
  DeleteEmployeeDeduct(deductId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Deducts/DeleteEmployeeDeduct?DeductId=' + deductId);
  }

  GetDeductTypesSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Deducts/GetDeductTypesSelector');
  }

    
  //================================== Careers ===============================
  GetAllEmployeeCareersData(model: SearchFilterModel) {
    return this.http.post<PagedResponseDTO<EmployeeCareerModel[]>>(this.URL + 'Careers/GetAllEmployeeCareersData', model);
  }
  GetCareersByEmployeeId(employeeId,model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<EmployeeCareerModel[]>>(this.URL + 'Careers/GetCareersByEmployeeId?EmployeeId='+employeeId, model);
  }
  AddNewEmployeeCareer(employeeId:number,model: EmployeeCareerModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Careers/AddNewEmployeeCareer?EmployeeId='+employeeId, model);
  }
  EditEmployeeCareer(employeeId:number,model: EmployeeCareerModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Careers/EditEmployeeCareer?EmployeeId='+employeeId, model);
  }
  DeleteEmployeeCareer(employeeCareerId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Careers/DeleteEmployeeCareer?EmployeeCareerId=' + employeeCareerId);
  }

  GetWorkStatusSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Careers/GetWorkStatusSelector');
  }
  GetJobsSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Careers/GetJobsSelector');
  }




    
  //================================== Loans ===============================
  GetAllEmployeeLoansData(model: SearchFilterModel) {
    return this.http.post<PagedResponseDTO<EmployeeLoanModel[]>>(this.URL + 'Loans/GetAllEmployeeLoansData', model);
  }
  GetLoansByEmployeeId(employeeId,model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<EmployeeLoanModel[]>>(this.URL + 'Loans/GetLoansByEmployeeId?EmployeeId='+employeeId, model);
  }
  AddNewEmployeeLoan(employeeId:number,model: EmployeeLoanModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Loans/AddNewEmployeeLoan?EmployeeId='+employeeId, model);
  }
  EditEmployeeLoan(employeeId:number,model: EmployeeLoanModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Loans/EditEmployeeLoan?EmployeeId='+employeeId, model);
  }
  DeleteEmployeeLoan(loanId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Loans/DeleteEmployeeLoan?LoanId=' + loanId);
  }

  GetLoanTypesSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Loans/GetLoanTypesSelector');
  }








  ChangePassword(model: any) {
    return this.http.post<any>(this.URL + 'User/ChangePassowrd', model);
  }


}
