using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.HR
{
    public interface IEmployeeAdvancesService
    {
        List<EmployeeAdvanceModel> GetEmployeeAdvancesData(SearchFilterModel SearchModel, int? EmployeeId=null, int? ManagerId=null);
        List<AdvancePaymentModel> GetAdvancePaymentsData(SearchFilterModel SearchModel, int? EmployeeId = null, int? ManagerId = null);
        List<EmployeeAdvanceModel> GetAdvancesByEmployeeId(int EmployeeId, SearchFilterModel SearchModel);
        EmployeeAdvanceModel GetAdvanceById(int EmployeeAdvanceId);
        ActionsResponseModel AddNewEmployeeAdvance(int EmployeeId, EmployeeAdvanceModel model);
        ActionsResponseModel EditEmployeeAdvance(int EmployeeId, EmployeeAdvanceModel model);
        ActionsResponseModel ApproveEmployeeAdvance(int EmployeeAdvanceId, bool IsApproved);
        ActionsResponseModel PostponeAdvancesInstallment(int EmployeeId, int AdvancePaymentId);
        ActionsResponseModel DeleteEmployeeAdvance(int EmployeeAdvanceId);
        List<SelectorDataModel> GetAdvanceTypesSelector();
        ActionsResponseModel ApproveEmployeeAdvances(bool IsApproved, List<int> RowsId);

    }
}
