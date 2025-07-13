using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.HR
{
    public interface IHRReportsService
    {
        DataTable GetPayrollReportVacations(SearchFilterModel SearchModel);
        DataTable GetPayrollReportOverTime(SearchFilterModel SearchModel);
        DataTable GetPayrollReportPenalties(SearchFilterModel SearchModel);
        DataTable GetPayrollReportSickLeaves(SearchFilterModel SearchModel);
        DataTable GetPayrollReportDeducts(SearchFilterModel SearchModel);
        DataTable GetPayrollReportAdvances(SearchFilterModel SearchModel);
        ActionsResponseModel ExportPayrollReportVacations(SearchFilterModel model);
        ActionsResponseModel ExportPayrollReportOverTime(SearchFilterModel model);
        ActionsResponseModel ExportPayrollReportPenalties(SearchFilterModel model);
        ActionsResponseModel ExportPayrollReportSickLeaves(SearchFilterModel model);
        ActionsResponseModel ExportPayrollReportDeducts(SearchFilterModel model);
        ActionsResponseModel ExportPayrollReportAdvances(SearchFilterModel model);


        #region ExpireReports
        List<EmployeeReportModel> GetEmployeesExpireReport_Data(int ReportType, SearchFilterModel model);
        ActionsResponseModel GetEmployeesExpireReport_Export(int ReportType, SearchFilterModel model);
        List<FilterModel> GetEmployeesExpireReport_Filters(int ReportType, SearchFilterModel model);
        #endregion

        #region NewComerEmployeesRepor
        List<EmployeeReportModel> GetNewComerEmployeesReport_Data(DateTime? FromDate, DateTime? ToDate, SearchFilterModel model);
        ActionsResponseModel GetNewComerEmployeesReport_Export(DateTime? FromDate, DateTime? ToDate, SearchFilterModel model);
        List<FilterModel> GetNewComerEmployeesReport_Filters(DateTime? FromDate, DateTime? ToDate, SearchFilterModel model);
        #endregion

        #region EmployeeSalaryAnnualIncreaseReport
        List<SalaryAnnualIncreaseModel> GetEmployeeSalaryAnnualIncreaseReport_Data( SearchFilterModel model);
        ActionsResponseModel GetEmployeeSalaryAnnualIncreaseReport_Export( SearchFilterModel model);
        List<FilterModel> GetEmployeeSalaryAnnualIncreaseReport_Filters( SearchFilterModel model);
        #endregion

        List<EmployeeSalarySummaryModel> GetSalariesReport_Data(int Month, int Year, SearchFilterModel SearchModel);
        ActionsResponseModel GetSalariesReport_Export(int Month, int Year, SearchFilterModel model);
        List<FilterModel> GetSalariesReport_Filters(int Month, int Year, SearchFilterModel SearchModel);

    }
}
