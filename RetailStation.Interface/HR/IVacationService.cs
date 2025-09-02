using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.HR;
using RetailStation.Entities.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.HR
{
    public interface IVacationService
    {
 
        List<EmployeeVacationDto> GetAllEmployeeVacationsData(SearchFilterModel SearchModel, int? EmployeeId = null, int? ManagerId = null);
        ActionsResponseModel GetEmployeeVacation_Export(SearchFilterModel model);

        List<EmployeeVacationDto> GetVacationsByEmployeeId(int EmployeeId,SearchFilterModel SearchModel);
        List<EmployeeVacationDto> GetVacationRequestsByType(int VacationTypeId, SearchFilterModel SearchModel);
        ActionsResponseModel AddNewEmployeeVacation(int EmployeeId, EmployeeVacationDto model);
        ActionsResponseModel EditVacation(int EmployeeId, EmployeeVacationDto model);
        ActionsResponseModel DeleteVacation(int VacationId);
        ActionsResponseModel ApproveEmployeeVacation(int LoanId, int EmployeeId, bool ApproveStatus);
        ActionsResponseModel ApproveEmployeeVacations(bool IsApproved, List<int> RowsId);
        List<EmployeeVacationDto> GetVacationsToBeExceuted();
        ActionsResponseModel EditEmployeesWorkStatus(string UserId, List<int> EmployeeIds);

    }
}
