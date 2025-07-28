using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.HR
{
    public interface IFinancialCustodyService
    {
 
        List<EmployeeFinancialCustodyModel> GetAllEmployeeFinancialCustodyData(SearchFilterModel SearchModel, int? EmployeeId = null, int? ManagerId = null);
        List<EmployeeFinancialCustodyModel> GetFinancialCustodyByEmployeeId(int EmployeeId,SearchFilterModel SearchModel);
        EmployeeFinancialCustodyModel GetFinancialCustodyById(int EmployeeFinancialCustodyId);
        ActionsResponseModel AddNewEmployeeFinancialCustody(int EmployeeId, EmployeeFinancialCustodyModel model);
        ActionsResponseModel EditFinancialCustody(int EmployeeId, EmployeeFinancialCustodyModel model);
        ActionsResponseModel DeleteFinancialCustody(int FinancialCustodyId);
        ActionsResponseModel ApproveEmployeeFinancialCustody(int LoanId, int EmployeeId, bool ApproveStatus);
        ActionsResponseModel ApproveEmployeeFinancialCustody(bool IsApproved, List<int> RowsId);

    }
}
