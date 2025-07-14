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
    public interface IVacationService
    {
 
        List<EmployeeVacationDto> GetAllEmployeeVacationsData(SearchFilterModel SearchModel, int? EmployeeId = null, int? ManagerId = null);
        List<EmployeeVacationDto> GetVacationsByEmployeeId(int EmployeeId,SearchFilterModel SearchModel);
        List<EmployeeVacationDto> GetVacationRequestsByType(int VacationTypeId, SearchFilterModel SearchModel);
        ActionsResponseModel AddNewEmployeeVacation(int EmployeeId, EmployeeVacationDto model);
        ActionsResponseModel EditVacation(int EmployeeId, EmployeeVacationDto model);
        ActionsResponseModel DeleteVacation(int VacationId);
        ActionsResponseModel ApproveEmployeeVacation(int LoanId, int EmployeeId, bool ApproveStatus);
        ActionsResponseModel ApproveEmployeeVacations(bool IsApproved, List<int> RowsId);

    }
}
