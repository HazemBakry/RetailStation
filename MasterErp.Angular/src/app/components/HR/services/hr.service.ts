import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SaveEmployeeModel } from 'src/app/components/HR/models/SaveEmployeeModel';
import { SearchFilterModel } from '../../Shared/models/FilterModel';

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

  GetActiveEmployees() {
    return this.http.get<any>(this.URL + 'Employee/GetActiveEmployees');
  }

  GetEmployeesFilter(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'Employee/GetEmployeesFilter', model);
  }

  // AddNewEmployee(model: SaveEmployeeModel) {
  //   return this.http.post<any>(this.URL + 'Employee/AddNewEmployee', model);
  // }

  AddNewEmployee(model: any) {
    return this.http.post<any>(this.URL + 'Employee/AddNewEmployee', model);
  }

  EditEmployeeData(model: any) {
    return this.http.post<any>(this.URL + 'Employee/EditEmployeeData', model);
  }

  RemoveEmployee(EmployeeId: string) {
    return this.http.get<any>(this.URL + 'Employee/RemoveEmployee?employeeId=' + EmployeeId);
  }


  GetAllEmployeeSalary() {
    return this.http.get<any>(this.URL + 'Employee/GetAllEmployeeSalary');
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
    return this.http.get<any>(this.URL + 'Employee/GetBranchData');
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

  //================================== OverTime ===============================

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

  //================================== OverTime ===============================

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

  //================================== OverTime ===============================

  GetVacationData(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'Vacation/GetVacationData', model);
  }

  AddNewVacation(model: any) {
    return this.http.post<any>(this.URL + 'Vacation/AddNewVacation', model);
  }

  EditVacation(model: any) {
    return this.http.post<any>(this.URL + 'Vacation/EditVacation', model);
  }

  DeleteVacation(VacationId: number) {
    return this.http.get<any>(this.URL + 'Vacation/DeleteVacation?VacationId=' + VacationId);
  }

  ChangePassword(model: any) {
    return this.http.post<any>(this.URL + 'User/ChangePassowrd', model);
  }


}
