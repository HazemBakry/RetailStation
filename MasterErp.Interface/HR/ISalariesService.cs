using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models.HR;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.HR
{
    public interface ISalariesService
    {

        List<EmployeeSalarySummaryModel> GetEmployeeSalarySummary(int Year, int Month, SearchFilterModel SearchModel);
        ActionsResponseModel GetEmployeeSalarySummary_Export(int Year, int Month, SearchFilterModel SearchModel);
        ActionsResponseModel ApproveMonthlySalary(int year, int month, SearchFilterModel searchModel);

        #region Employee Dues
        List<EmployeeDueModel> GetEmployeeDues(int EmployeeId, SearchFilterModel SearchModel);
        DateTime? GetEmployeeDueStartDate(int EmployeeId);
        EmployeeDueModel CalculateEmployeeDue(int EmployeeId, EmployeeDueModel Model);
        ActionsResponseModel SaveEmployeeDue(int EmployeeId, EmployeeDueModel Model);
        #endregion

    }
}
