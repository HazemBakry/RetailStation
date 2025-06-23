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
        List<EmployeeExpireReportModel> GetEmployeesExpireReport_Data(int ReportType, SearchFilterModel model);
        ActionsResponseModel GetEmployeesExpireReport_Export(int ReportType, SearchFilterModel model);
        List<FilterModel> GetEmployeesExpireReport_Filters(int ReportType, SearchFilterModel model);
        #endregion
    }
}
