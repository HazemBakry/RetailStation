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
    public interface IPenaltyService
    {
        List< EmployeePenaltyDto> GetAllEmployeePenaltiesData(SearchFilterModel SearchModel);
        List< EmployeePenaltyDto> GetPenaltiesByEmployeeId(int EmployeeId, SearchFilterModel SearchModel);
        ActionsResponseModel AddNewEmployeePenalty(int EmployeeId,  EmployeePenaltyDto Model);
        ActionsResponseModel EditEmployeePenalty(int EmployeeId,  EmployeePenaltyDto Model);
        ActionsResponseModel DeleteEmployeePenalty(int PenaltyId);
        List<SelectorDataModel> GetPenaltyTypesSelector();
        ActionsResponseModel ApproveEmployeePenalties(bool IsApproved, List<int> RowsId);

    }
}
