import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FilterItem, FilterModel, SearchFilterModel } from '../../Shared/models/FilterModel';
import { FormDropdownModel } from '../../Shared/components/drop-down-form-control/drop-down-form-control.component';
import { EmployeeVacationModel } from '../models/EmployeeVacationModel';
import { PagedResponseDTO } from '../../Shared/models/PagedResponseDTO';
import { ActionsResponseModel } from '../../Shared/models/ActionsResponseModel';
import { EmployeePenaltyModel } from '../models/EmployeePenaltyModel';
import { EmployeeOverTimeModel } from '../models/EmployeeOverTimeModel';
import { EmployeeSickLeaveModel } from '../models/EmployeeSickLeaveModel';
import { EmployeeDeductModel } from '../models/EmployeeDeductModel';
import { EmployeeCareerModel } from '../models/EmployeeCareerModel';
import { EmployeeLoanModel } from '../models/EmployeeLoanModel';
import { EmployeeSalaryModel } from '../models/Employee/EmployeeSalaryModel';
import { EmployeeContractModel } from '../models/Employee/EmployeeContractModel';
import { Observable } from 'rxjs';
import { AdvancePaymentModel, EmployeeAdvanceModel } from '../models/EmployeeAdvanceModel';
import { EmployeeAdvancedAttendanceModel, EmployeeAttendanceModel } from '../models/EmployeeAttendanceModel';
import { ChartSalarySummaryModel, EmployeeSalarySummaryModel } from '../models/EmployeeSalarySummaryModel';
import { DuesPreparationModel, EmployeeDueModel } from '../models/EmployeeDueModel';
import { SponsorModel } from '../models/SponsoModel';
import { DepartmentModel } from '../models/DepartmentModel';
import { EmployeeReportModel, SalaryAnnualIncreaseModel, SalaryHistoryModel } from '../models/EmployeeReportModel';
import { EmployeeStatusEnum } from '../../Shared/Enums/EmployeeStatusEnum';
import { DueTypeEnum } from '../../Shared/Enums/DueTypeEnum';
import { EmployeeStatusModel } from '../models/EmployeeStatusModel';
import { EmployeeFinancialCustodyModel } from '../models/EmployeeFinancialCustodyModel';

@Injectable({
  providedIn: 'root'
})
export class HrService {
  URL = environment.apiURL;

  payrollProcessTypes: any[] = [
    {
      id: 1,
      value: 1,
      name: "الأجازات",
    },
    {
      id: 2,
      value: 2,
      name: "ساعات العمل الاضافية",
    },
    {
      id: 3,
      value: 3,
      name: "الجزاءات",
    },
    // {
    //   id: 4,
    //   value: 4,
    //   name: "الاجازات المرضية",
    // },
    {
      id: 5,
      value: 5,
      name: "الخصم",
    },
    {
      id: 6,
      value: 6,
      name: "السلف",
    },
    {
      id: 7,
      value: 7,
      name: "طلبات مستحقات الموظفين",
    }
  ];



  constructor(private http: HttpClient) { }

  GetPayrollReportData(type: number, model: SearchFilterModel): Observable<any> {
    const fetchFn = new Map<number, () => Observable<any>>([
      [1, () => this.GetPayrollReportVacations(model)],
      [2, () => this.GetPayrollReportOverTime(model)],
      [3, () => this.GetPayrollReportPenalties(model)],
      [4, () => this.GetPayrollReportSickLeaves(model)],
      [5, () => this.GetPayrollReportDeducts(model)],
      [6, () => this.GetPayrollReportAdvances(model)],
      [7, () => this.GetPayrollReportEmployeesDues(model)],
    ]).get(type);

    if (fetchFn) return fetchFn();
  }

  ExportPayrollReportData(type: number, model: SearchFilterModel): Observable<any> {
    const fetchFn = new Map<number, () => Observable<any>>([
      [1, () => this.ExportPayrollReportVacations(model)],
      [2, () => this.ExportPayrollReportOverTime(model)],
      [3, () => this.ExportPayrollReportPenalties(model)],
      [4, () => this.ExportPayrollReportSickLeaves(model)],
      [5, () => this.ExportPayrollReportDeducts(model)],
      [6, () => this.ExportPayrollReportAdvances(model)],
    ]).get(type);

    if (fetchFn) return fetchFn();
  }
  ApprovePayrollReportData(type: number, rowsId: number[], isApproved: boolean = true): Observable<any> {
    const fetchFn = new Map<number, () => Observable<any>>([
      [1, () => this.ApproveEmployeeVacations(rowsId, isApproved)],
      [2, () => this.ApproveEmployeeOverTime(rowsId, isApproved)],
      [3, () => this.ApproveEmployeePenalties(rowsId, isApproved)],
      [4, () => this.ApproveEmployeeSickLeaves(rowsId, isApproved)],
      [5, () => this.ApproveEmployeeDeducts(rowsId, isApproved)],
      [6, () => this.ApproveEmployeeAdvances(rowsId, isApproved)],
      [7, () => this.ApproveEmployeeDues(rowsId, isApproved)],
    ]).get(type);

    if (fetchFn) return fetchFn();
  }
  ApproveEmployeeVacations(employeeVacationsId: number[], isApproved: boolean = true) {
    return this.http.post<ActionsResponseModel>(this.URL + `Vacation/ApproveEmployeeVacations?IsApproved=${isApproved}`, employeeVacationsId);
  }
  ApproveEmployeeOverTime(employeeOverTimeId: number[], isApproved: boolean = true) {
    return this.http.post<ActionsResponseModel>(this.URL + `OverTime/ApproveEmployeeOverTime?IsApproved=${isApproved}`, employeeOverTimeId);
  }


  ApproveEmployeePenalties(employeePenaltiesId: number[], isApproved: boolean = true) {
    return this.http.post<ActionsResponseModel>(this.URL + `Penalty/ApproveEmployeePenalties?IsApproved=${isApproved}`, employeePenaltiesId);
  }
  ApproveEmployeeSickLeaves(employeeSickLeavesId: number[], isApproved: boolean = true) {
    return this.http.post<ActionsResponseModel>(this.URL + `SickLeave/ApproveEmployeeSickLeaves?IsApproved=${isApproved}`, employeeSickLeavesId);
  }
  ApproveEmployeeDeducts(employeeDeductsId: number[], isApproved: boolean = true) {
    return this.http.post<ActionsResponseModel>(this.URL + `Deducts/ApproveEmployeeDeducts?IsApproved=${isApproved}`, employeeDeductsId);
  }
  ApproveEmployeeAdvances(employeeAdvancesId: number[], isApproved: boolean = true) {
    return this.http.post<ActionsResponseModel>(this.URL + `EmployeeAdvances/ApproveEmployeeAdvances?IsApproved=${isApproved}`, employeeAdvancesId);
  }
  ApproveEmployeeDues(employeeAdvancesId: number[], isApproved: boolean = true) {
    return this.http.post<ActionsResponseModel>(this.URL + `Salaries/ApproveEmployeeDues?IsApproved=${isApproved}`, employeeAdvancesId);
  }


  //================================== PayrollReport ===============================

  GetPayrollReportVacations(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'HRReports/GetPayrollReportVacations', model);
  }

  GetPayrollReportOverTime(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'HRReports/GetPayrollReportOverTime', model);
  }

  GetPayrollReportPenalties(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'HRReports/GetPayrollReportPenalties', model);
  }

  GetPayrollReportSickLeaves(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'HRReports/GetPayrollReportSickLeaves', model);
  }

  GetPayrollReportDeducts(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'HRReports/GetPayrollReportDeducts', model);
  }

  GetPayrollReportAdvances(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'HRReports/GetPayrollReportAdvances', model);
  }

  GetPayrollReportEmployeesDues(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'HRReports/GetPayrollReportEmployeesDues', model);
  }

  GetSalariesReport_Data(month: number, year: number, model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'HRReports/GetSalariesReport_Data?Month=' + month + '&Year=' + year, model);
  }

  GetSalariesReport_Filters(month: number, year: number, model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'HRReports/GetSalariesReport_Filters?Month=' + month + '&Year=' + year, model);
  }

  GetSalariesReport_Export(month: number, year: number, model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'HRReports/GetSalariesReport_Export?Month=' + month + '&Year=' + year, model);
  }

  ExportPayrollReportVacations(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'HRReports/ExportPayrollReportVacations', model);
  }

  ExportPayrollReportOverTime(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'HRReports/ExportPayrollReportOverTime', model);
  }

  ExportPayrollReportPenalties(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'HRReports/ExportPayrollReportPenalties', model);
  }

  ExportPayrollReportSickLeaves(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'HRReports/ExportPayrollReportSickLeaves', model);
  }

  ExportPayrollReportDeducts(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'HRReports/ExportPayrollReportDeducts', model);
  }

  ExportPayrollReportAdvances(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'HRReports/ExportPayrollReportAdvances', model);
  }

  ExportSalarySummaryData(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'HRReports/ExportSalarySummaryData', model);
  }

  //================================== Employees ===============================

  GetAllEmployeesSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + `Employee/GetAllEmployeesSelector`);
  }

  GetActiveEmployeesSelector(empStatusId: EmployeeStatusEnum = EmployeeStatusEnum.Active) {
    var params = empStatusId ? `?EmployeeStatusId=${empStatusId}` : '';
    return this.http.get<FormDropdownModel[]>(this.URL + `Employee/GetActiveEmployeesSelector${params}`);
  }

  GetEmployeesSummary_Data(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'Employee/GetEmployeesSummary_Data', model);
  }

  ExportEmployeesSummaryData(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'Employee/ExportEmployeesSummaryData', model);
  }

  GetEmployeesSummary_Filters(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'Employee/GetEmployeesSummary_Filters', model);
  }

  GetEmployeeRequests_Data(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'Employee/GetEmployeeRequests_Data', model);
  }

  GetEmployeesByVacationTypes(VacationTypeId: number) {
    return this.http.get<any>(this.URL + 'Employee/GetEmployeesByVacationTypes?VacationTypeId=' + VacationTypeId);
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

  GetEmployeeContractDetails(EmployeeId: number) {
    return this.http.get<EmployeeContractModel>(this.URL + 'Employee/GetEmployeeContractDetails?EmployeeId=' + EmployeeId);
  }

  GetEmployeesSalaryByBranch(branches: number[], ExecutionDate: any) {
    return this.http.post<EmployeeSalaryModel[]>(this.URL + 'Employee/GetEmployeesSalaryByBranch?ExecutionDate=' + ExecutionDate, branches);
  }
  GetEmployeeSalarySummary(year: number, month: number, model: PagedResponseDTO<EmployeeSalarySummaryModel[]>) {
    year = year ?? new Date().getFullYear();
    month = month ?? new Date().getMonth() + 1;
    return this.http.post<PagedResponseDTO<EmployeeSalarySummaryModel[]>>(this.URL + 'Salaries/GetEmployeeSalarySummary?Year=' + year + '&Month=' + month, model);
  }

  GetEmployeeSalarySummary_Export(year: number, month: number, model: PagedResponseDTO<EmployeeSalarySummaryModel[]>) {
    year = year ?? new Date().getFullYear();
    month = month ?? new Date().getMonth() + 1;
    return this.http.post<ActionsResponseModel>(this.URL + 'Salaries/GetEmployeeSalarySummary_Export?Year=' + year + '&Month=' + month, model);
  }

  ApproveMonthlySalary(year: number, month: number, model: PagedResponseDTO<EmployeeSalarySummaryModel[]>) {
    year = year ?? new Date().getFullYear();
    month = month ?? new Date().getMonth() + 1;
    return this.http.post<ActionsResponseModel>(this.URL + 'Salaries/ApproveMonthlySalary?Year=' + year + '&Month=' + month, model);
  }

  //////////// Employee Dues //
  GetEmployeesForDuesSelector(dueType: DueTypeEnum) {
    var params = dueType ? `?DueType=${dueType}` : '';
    return this.http.get<FormDropdownModel[]>(this.URL + `Salaries/GetEmployeesForDuesSelector${params}`);
  }
  GetDues_Data(filter: SearchFilterModel): Observable<PagedResponseDTO<EmployeeDueModel[]>> {
    return this.http.post<PagedResponseDTO<EmployeeDueModel[]>>(this.URL + `Salaries/GetDues_Data`, filter);
  }
  GetEmployeeDuesById(employeeDuesId: number) {
    return this.http.get<EmployeeDueModel>(this.URL + 'Salaries/GetEmployeeDuesById?EmployeeDuesId=' + employeeDuesId);
  }
  getEmployeeDues(employeeId: number, filter: SearchFilterModel): Observable<PagedResponseDTO<EmployeeDueModel[]>> {
    return this.http.post<PagedResponseDTO<EmployeeDueModel[]>>(this.URL + `Salaries/GetEmployeeDues?EmployeeId=${employeeId}`, filter);
  }
  DeleteEmployeeDues(employeeDuesId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Salaries/DeleteEmployeeDues?EmployeeDuesId=' + employeeDuesId);
  }
  GetEmployeeDuesPreparationDate(employeeId: number, dueType: DueTypeEnum, model: DuesPreparationModel): Observable<DuesPreparationModel> {
    const params = new URLSearchParams();

    params.append('EmployeeId', employeeId.toString());

    if (dueType !== null) {
      params.append('DueType', dueType.toString());
    }
    // if (executionDate != null) {
    //   params.append('ExecutionDate', executionDate);
    // }

    const queryString = params.toString();
    return this.http.post<DuesPreparationModel>(this.URL + 'Salaries/GetEmployeeDuesPreparationDate' + (queryString ? `?${queryString}` : ''), model);
  }

  CalculateEmployeeDue(employeeId: number, model: EmployeeDueModel): Observable<EmployeeDueModel> {
    return this.http.post<EmployeeDueModel>(this.URL + `Salaries/CalculateEmployeeDue?EmployeeId=${employeeId}`, model);
  }

  SaveEmployeeDue(employeeId: number, model: DuesPreparationModel): Observable<ActionsResponseModel> {
    return this.http.post<ActionsResponseModel>(this.URL + `Salaries/SaveEmployeeDue?EmployeeId=${employeeId}`, model);
  }


  ///////////////////////////

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

  GetHRDashboardStatistics() {
    return this.http.get<any>(this.URL + 'Employee/GetHRDashboardStatistics');
  }

  GetDashboardSalaries_Statistics() {
    return this.http.get<ChartSalarySummaryModel[]>(this.URL + 'Employee/GetDashboardSalaries_Statistics');
  }

  UpdateEmployeeLastJoinDate(EmployeeId: number, LastJoinDate: any) {
    return this.http.get<any>(this.URL + 'Employee/UpdateEmployeeLastJoinDate?EmployeeId=' + EmployeeId + '&LastJoinDate=' + LastJoinDate);
  }

  //================================== Attendance ===============================

  GetAttendanceReport_Data(fromDate: string, toDate: string, model: SearchFilterModel) {
    fromDate = fromDate ?? '';
    toDate = toDate ?? '';
    return this.http.post<PagedResponseDTO<EmployeeAttendanceModel[]>>(this.URL + 'Attendance/GetAttendanceReport_Data?FromDate=' + fromDate + '&ToDate=' + toDate, model);
  }
  GetAdvancedAttendanceReport_Data(fromDate: string, toDate: string, model: SearchFilterModel) {
    fromDate = fromDate ?? '';
    toDate = toDate ?? '';
    return this.http.post<PagedResponseDTO<EmployeeAdvancedAttendanceModel[]>>(this.URL + 'Attendance/GetAdvancedAttendanceReport_Data?FromDate=' + fromDate + '&ToDate=' + toDate, model);
  }
  ApproveEmployeesAttendance(fromDate: string, toDate: string, model: SearchFilterModel) {
    fromDate = fromDate ?? '';
    toDate = toDate ?? '';
    return this.http.post<ActionsResponseModel>(this.URL + 'Attendance/ApproveEmployeesAttendance?FromDate=' + fromDate + '&ToDate=' + toDate, model);
  }
  GetAttendance_Data(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'Attendance/GetAttendance_Data', model);
  }

  GetAttendance_Filters(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'Attendance/GetAttendance_Filters', model);
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
  GetEmployeeVacation_Export(model: SearchFilterModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `Vacation/GetEmployeeVacation_Export`, model);
  }
  GetVacationsByEmployeeId(employeeId, model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<EmployeeVacationModel[]>>(this.URL + 'Vacation/GetVacationsByEmployeeId?EmployeeId=' + employeeId, model);
  }

  GetVacationRequestsByType(vacationTypeId: number, model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<EmployeeVacationModel[]>>(this.URL + 'Vacation/GetVacationRequestsByType?VacationTypeId=' + vacationTypeId, model);
  }

  AddNewEmployeeVacation(employeeId: number, model: EmployeeVacationModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Vacation/AddNewEmployeeVacation?EmployeeId=' + employeeId, model);
  }

  EditEmployeeVacation(employeeId: number, model: EmployeeVacationModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Vacation/EditEmployeeVacation?EmployeeId=' + employeeId, model);
  }

  DeleteVacation(VacationId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Vacation/DeleteVacation?VacationId=' + VacationId);
  }

  GetVacationsToBeExceuted() {
    return this.http.get<PagedResponseDTO<EmployeeVacationModel[]>>(this.URL + 'Vacation/GetVacationsToBeExceuted');
  }

  EditEmployeesWorkStatus(employeeIds: number[]) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Vacation/EditEmployeesWorkStatus', employeeIds);
  }

  //================================== FinancialCustody ===============================

  GetAllEmployeeFinancialCustodyData(model: SearchFilterModel) {
    return this.http.post<any>(this.URL + 'FinancialCustody/GetAllEmployeeFinancialCustodyData', model);
  }
  GetAllEmployeeFinancialCustody_Export(model: SearchFilterModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `FinancialCustody/GetAllEmployeeFinancialCustody_Export`, model);
  }
  GetFinancialCustodyByEmployeeId(employeeId, model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<EmployeeFinancialCustodyModel[]>>(this.URL + 'FinancialCustody/GetFinancialCustodyByEmployeeId?EmployeeId=' + employeeId, model);
  }
  GetFinancialCustodyById(EmployeeFinancialCustodyId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'FinancialCustody/GetFinancialCustodyById?EmployeeFinancialCustodyId=' + EmployeeFinancialCustodyId);
  }

  AddNewEmployeeFinancialCustody(employeeId: number, model: EmployeeFinancialCustodyModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'FinancialCustody/AddNewEmployeeFinancialCustody?EmployeeId=' + employeeId, model);
  }

  EditEmployeeFinancialCustody(employeeId: number, model: EmployeeFinancialCustodyModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'FinancialCustody/EditEmployeeFinancialCustody?EmployeeId=' + employeeId, model);
  }

  DeleteFinancialCustody(EmployeeFinancialCustodyId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'FinancialCustody/DeleteFinancialCustody?EmployeeFinancialCustodyId=' + EmployeeFinancialCustodyId);
  }



  //================================== OverTime ===============================
  GetAllEmployeeOverTimeData(model: SearchFilterModel) {
    return this.http.post<PagedResponseDTO<EmployeeOverTimeModel[]>>(this.URL + 'OverTime/GetAllEmployeeOverTimeData', model);
  }
  GetOverTimeByEmployeeId(employeeId, model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<EmployeeOverTimeModel[]>>(this.URL + 'OverTime/GetOverTimeByEmployeeId?EmployeeId=' + employeeId, model);
  }
  AddNewEmployeeOverTime(employeeId: number, model: EmployeeOverTimeModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'OverTime/AddNewEmployeeOverTime?EmployeeId=' + employeeId, model);
  }
  EditEmployeeOverTime(employeeId: number, model: EmployeeOverTimeModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'OverTime/EditEmployeeOverTime?EmployeeId=' + employeeId, model);
  }
  DeleteEmployeeOverTime(overTimeId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'OverTime/DeleteEmployeeOverTime?OverTimeId=' + overTimeId);
  }

  //================================== Penalty ===============================

  GetAllEmployeePenaltiesData(model: SearchFilterModel) {
    return this.http.post<PagedResponseDTO<EmployeePenaltyModel[]>>(this.URL + 'Penalty/GetAllEmployeePenaltiesData', model);
  }
  GetPenaltiesByEmployeeId(employeeId, model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<EmployeePenaltyModel[]>>(this.URL + 'Penalty/GetPenaltiesByEmployeeId?EmployeeId=' + employeeId, model);
  }
  AddNewEmployeePenalty(employeeId: number, model: EmployeePenaltyModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Penalty/AddNewEmployeePenalty?EmployeeId=' + employeeId, model);
  }
  EditEmployeePenalty(employeeId: number, model: EmployeePenaltyModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Penalty/EditEmployeePenalty?EmployeeId=' + employeeId, model);
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
  GetSickLeavesByEmployeeId(employeeId, model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<EmployeeSickLeaveModel[]>>(this.URL + 'SickLeave/GetSickLeavesByEmployeeId?EmployeeId=' + employeeId, model);
  }
  AddNewEmployeeSickLeave(employeeId: number, model: EmployeeSickLeaveModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'SickLeave/AddNewEmployeeSickLeave?EmployeeId=' + employeeId, model);
  }
  EditEmployeeSickLeave(employeeId: number, model: EmployeeSickLeaveModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'SickLeave/EditEmployeeSickLeave?EmployeeId=' + employeeId, model);
  }
  DeleteEmployeeSickLeave(overTimeId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'SickLeave/DeleteEmployeeSickLeave?SickLeaveId=' + overTimeId);
  }




  //================================== Deducts ===============================
  GetAllEmployeeDeductsData(model: SearchFilterModel) {
    return this.http.post<PagedResponseDTO<EmployeeDeductModel[]>>(this.URL + 'Deducts/GetAllEmployeeDeductsData', model);
  }
  GetDeductsByEmployeeId(employeeId, model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<EmployeeDeductModel[]>>(this.URL + 'Deducts/GetDeductsByEmployeeId?EmployeeId=' + employeeId, model);
  }
  AddNewEmployeeDeduct(employeeId: number, model: EmployeeDeductModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Deducts/AddNewEmployeeDeduct?EmployeeId=' + employeeId, model);
  }
  EditEmployeeDeduct(employeeId: number, model: EmployeeDeductModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Deducts/EditEmployeeDeduct?EmployeeId=' + employeeId, model);
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
  GetCareersByEmployeeId(employeeId, model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<EmployeeCareerModel[]>>(this.URL + 'Careers/GetCareersByEmployeeId?EmployeeId=' + employeeId, model);
  }
  AddNewEmployeeCareer(employeeId: number, model: EmployeeCareerModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Careers/AddNewEmployeeCareer?EmployeeId=' + employeeId, model);
  }
  EditEmployeeCareer(employeeId: number, model: EmployeeCareerModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Careers/EditEmployeeCareer?EmployeeId=' + employeeId, model);
  }
  DeleteEmployeeCareer(employeeCareerId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Careers/DeleteEmployeeCareer?EmployeeCareerId=' + employeeCareerId);
  }

  GetJobsSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Careers/GetJobsSelector');
  }





  //================================== Loans ===============================
  GetAllEmployeeLoansData(model: SearchFilterModel) {
    return this.http.post<PagedResponseDTO<EmployeeLoanModel[]>>(this.URL + 'Loans/GetAllEmployeeLoansData', model);
  }
  GetLoansByEmployeeId(employeeId, model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<EmployeeLoanModel[]>>(this.URL + 'Loans/GetLoansByEmployeeId?EmployeeId=' + employeeId, model);
  }
  AddNewEmployeeLoan(employeeId: number, model: EmployeeLoanModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Loans/AddNewEmployeeLoan?EmployeeId=' + employeeId, model);
  }
  EditEmployeeLoan(employeeId: number, model: EmployeeLoanModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'Loans/EditEmployeeLoan?EmployeeId=' + employeeId, model);
  }
  DeleteEmployeeLoan(loanId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'Loans/DeleteEmployeeLoan?LoanId=' + loanId);
  }

  GetLoanTypesSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'Loans/GetLoanTypesSelector');
  }

  //================================== Advances ===============================
  GetAllEmployeeAdvancesData(model: SearchFilterModel) {
    return this.http.post<PagedResponseDTO<EmployeeAdvanceModel[]>>(this.URL + 'EmployeeAdvances/GetAllEmployeeAdvancesData', model);
  }
  GetAdvancePaymentsData(employeeId, model: PagedResponseDTO, employeeAdvanceId: number = null) {
    var params = employeeAdvanceId ? `?EmployeeId=${employeeId}&EmployeeAdvanceId=${employeeAdvanceId}` : `?EmployeeId=${employeeId}`;
    return this.http.post<PagedResponseDTO<AdvancePaymentModel[]>>(this.URL + `EmployeeAdvances/GetAdvancePaymentsData${params}`, model);
  }
  getAdvanceById(employeeAdvanceId): Observable<EmployeeAdvanceModel> {
    return this.http.get<EmployeeAdvanceModel>(this.URL + 'EmployeeAdvances/GetAdvanceById?EmployeeAdvanceId=' + employeeAdvanceId);
  }
  GetAdvancesByEmployeeId(employeeId, model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<EmployeeAdvanceModel[]>>(this.URL + 'EmployeeAdvances/GetAdvancesByEmployeeId?EmployeeId=' + employeeId, model);
  }
  GetAdvancesPaymentsByEmployeeId(employeeId, model: PagedResponseDTO) {
    return this.http.post<PagedResponseDTO<EmployeeAdvanceModel[]>>(this.URL + 'EmployeeAdvances/GetAdvancesPaymentsByEmployeeId?EmployeeId=' + employeeId, model);
  }
  AddNewEmployeeAdvance(employeeId: number, model: EmployeeAdvanceModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'EmployeeAdvances/AddNewEmployeeAdvance?EmployeeId=' + employeeId, model);
  }
  EditEmployeeAdvance(employeeId: number, model: EmployeeAdvanceModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'EmployeeAdvances/EditEmployeeAdvance?EmployeeId=' + employeeId, model);
  }
  ApproveEmployeeAdvance(employeeAdvanceId: number, isApproved: boolean = true) {
    return this.http.get<ActionsResponseModel>(this.URL + `EmployeeAdvances/ApproveEmployeeAdvance?EmployeeAdvanceId=${employeeAdvanceId}&IsApproved=${isApproved}`);
  }
  PostponeAdvancesInstallment(employeeId: number, advancePaymentId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `EmployeeAdvances/PostponeAdvancesInstallment?EmployeeId=${employeeId}&AdvancePaymentId=${advancePaymentId}`);
  }
  DeleteEmployeeAdvance(employeeAdvanceId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + 'EmployeeAdvances/DeleteEmployeeAdvance?EmployeeAdvanceId=' + employeeAdvanceId);
  }

  GetAdvanceTypesSelector() {
    return this.http.get<FormDropdownModel[]>(this.URL + 'EmployeeAdvances/GetAdvanceTypesSelector');
  }







  ChangePassword(model: any) {
    return this.http.post<any>(this.URL + 'User/ChangePassowrd', model);
  }





  ////////////////////////// sponsor ///////////////////

  GetSponsorsData(model: PagedResponseDTO<SponsorModel[]>) {
    return this.http.post<PagedResponseDTO<SponsorModel[]>>(this.URL + 'HR/GetSponsorsData', model);
  }

  GetSponsorById(sponsorId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `HR/GetSponsorById?SponsorId=${sponsorId}`);
  }

  CreateNewSponsor(model: SponsorModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'HR/CreateNewSponsor', model);
  }

  EditSponsor(sponsorId: number, model: SponsorModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `HR/EditSponsor?SponsorId=${sponsorId}`, model);
  }

  DeleteSponsor(sponsorId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `HR/DeleteSponsor?SponsorId=${sponsorId}`);
  }

  ////////////////////////// departments ///////////////////

  GetDepartmentsData(model: PagedResponseDTO<DepartmentModel[]>) {
    return this.http.post<PagedResponseDTO<DepartmentModel[]>>(this.URL + 'HR/GetDepartmentsData', model);
  }
  GetDepartmentById(departmentId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `HR/GetDepartmentById?DepartmentId=${departmentId}`);
  }
  CreateNewDepartment(model: DepartmentModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'HR/CreateNewDepartment', model);
  }

  EditDepartment(departmentId: number, model: DepartmentModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `HR/EditDepartment?DepartmentId=${departmentId}`, model);
  }
  DeleteDepartment(departmentId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `HR/DeleteDepartment?DepartmentId=${departmentId}`);
  }


   ////////////////////////// sponsor ///////////////////

  GetEmployeeStatusData(model: PagedResponseDTO<EmployeeStatusModel[]>) {
    return this.http.post<PagedResponseDTO<EmployeeStatusModel[]>>(this.URL + 'HR/GetEmployeeStatusData', model);
  }

  GetEmployeeStatusById(sponsorId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `HR/GetEmployeeStatusById?EmployeeStatusId=${sponsorId}`);
  }

  CreateNewEmployeeStatus(model: EmployeeStatusModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'HR/CreateNewEmployeeStatus', model);
  }

  EditEmployeeStatus(sponsorId: number, model: EmployeeStatusModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `HR/EditEmployeeStatus?EmployeeStatusId=${sponsorId}`, model);
  }

  DeleteEmployeeStatus(sponsorId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `HR/DeleteEmployeeStatus?EmployeeStatusId=${sponsorId}`);
  }
  // ------------------------------------------- Jobs ------------------------------------------- //

  GetJobsData(model: PagedResponseDTO<any[]>) {
    return this.http.post<PagedResponseDTO<any[]>>(this.URL + 'HR/GetJobsData', model);
  }

  CreateNewJob(model: any) {
    return this.http.post<ActionsResponseModel>(this.URL + 'HR/CreateNewJob', model);
  }

  EditJob(jobId: number, model: any) {
    return this.http.post<ActionsResponseModel>(this.URL + `HR/EditJob?JobId=${jobId}`, model);
  }

  DeleteJob(jobId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `HR/DeleteJob?JobId=${jobId}`);
  }

  // ------------------------------------------- Regions ------------------------------------------- //

  GetRegionsData(model: PagedResponseDTO<any[]>) {
    return this.http.post<PagedResponseDTO<any[]>>(this.URL + 'HR/GetRegionsData', model);
  }

  CreateNewRegion(model: any) {
    return this.http.post<ActionsResponseModel>(this.URL + 'HR/CreateNewRegion', model);
  }

  EditRegion(regionId: number, model: any) {
    return this.http.post<ActionsResponseModel>(this.URL + `HR/EditRegion?RegionId=${regionId}`, model);
  }

  DeleteRegion(regionId: number) {
    return this.http.get<ActionsResponseModel>(this.URL + `HR/DeleteRegion?RegionId=${regionId}`);
  }

  //---------------------------------------------------------------------------------------------------------------------------------//


  /////////////////////////// expired report 
  GetEmployeesExpireReport_Data(reportType: number, fromDate: any, toDate: any, model: SearchFilterModel) {
    return this.http.post<PagedResponseDTO<EmployeeReportModel[]>>(this.URL + 'HRReports/GetEmployeesExpireReport_Data?ReportType=' + reportType + '&FromDate=' + fromDate + '&ToDate=' + toDate, model);
  }

  GetEmployeesExpireReport_Export(reportType: number, fromDate: any, toDate: any, model: SearchFilterModel) {
    return this.http.post<ActionsResponseModel>(this.URL + 'HRReports/GetEmployeesExpireReport_Export?ReportType=' + reportType + '&FromDate=' + fromDate + '&ToDate=' + toDate, model);
  }
  
  GetEmployeesExpireReport_Filters(reportType: number, fromDate: any, toDate: any, model: SearchFilterModel) {
    return this.http.post<FilterModel[]>(this.URL + 'HRReports/GetEmployeesExpireReport_Filters?ReportType=' + reportType + '&FromDate=' + fromDate + '&ToDate=' + toDate, model);
  }



  /////////////////////////// new comer report 
  GetNewComerEmployeesReport_Data(fromDate: string, toDate: string, model: SearchFilterModel) {
    return this.http.post<PagedResponseDTO<EmployeeReportModel[]>>(this.URL + `HRReports/GetNewComerEmployeesReport_Data?FromDate=${fromDate}&ToDate=${toDate}`, model);
  }
  GetNewComerEmployeesReport_Export(fromDate: string, toDate: string, model: SearchFilterModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `HRReports/GetNewComerEmployeesReport_Export?FromDate=${fromDate}&ToDate=${toDate}`, model);
  }
  GetNewComerEmployeesReport_Filters(fromDate: string, toDate: string, model: SearchFilterModel) {
    return this.http.post<FilterModel[]>(this.URL + `HRReports/GetNewComerEmployeesReport_Filters?FromDate=${fromDate}&ToDate=${toDate}`, model);
  }

  /////////////////////////// salary increase
  GetEmployeeSalaryAnnualIncreaseReport_Data(model: SearchFilterModel) {
    return this.http.post<PagedResponseDTO<SalaryAnnualIncreaseModel[]>>(this.URL + `HRReports/GetEmployeeSalaryAnnualIncreaseReport_Data`, model);
  }
  GetEmployeeSalaryAnnualIncreaseReport_Export(model: SearchFilterModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `HRReports/GetEmployeeSalaryAnnualIncreaseReport_Export`, model);
  }
  GetEmployeeSalaryAnnualIncreaseReport_Filters(model: SearchFilterModel) {
    return this.http.post<FilterModel[]>(this.URL + `HRReports/GetEmployeeSalaryAnnualIncreaseReport_Filters`, model);
  }

  GetEmployeeSalaryHistory_Data(employeeId: number, model: SearchFilterModel) {
    return this.http.post<PagedResponseDTO<SalaryHistoryModel[]>>(this.URL + `HRReports/GetEmployeeSalaryHistory_Data?EmployeeId=${employeeId}`, model);
  }
  GetEmployeeSalaryHistory_Export(employeeId: number, model: SearchFilterModel) {
    return this.http.post<ActionsResponseModel>(this.URL + `HRReports/GetEmployeeSalaryHistory_Export?EmployeeId=${employeeId}`, model);
  }

}
