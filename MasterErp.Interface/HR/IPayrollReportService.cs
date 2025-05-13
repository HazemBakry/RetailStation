using MasterErp.Entities.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.HR
{
    public interface IPayrollReportService
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
    }
}
