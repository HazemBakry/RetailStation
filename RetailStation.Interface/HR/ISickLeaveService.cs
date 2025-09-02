using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.HR;
using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.HR
{
    public interface ISickLeaveService
    {
        List<EmployeeSickLeaveDto> GetAllEmployeeSickLeaves(SearchFilterModel SearchModel);
        List<EmployeeSickLeaveDto> GetSickLeavesByEmployeeId(int EmployeeId, SearchFilterModel SearchModel);
        ActionsResponseModel AddNewEmployeeSickLeave(int EmployeeId, EmployeeSickLeaveDto model);
        ActionsResponseModel EditEmployeeSickLeave(int EmployeeId, EmployeeSickLeaveDto model);
        ActionsResponseModel DeleteEmployeeSickLeave(int SickLeaveId);
        ActionsResponseModel ApproveEmployeeSickLeaves(bool IsApproved, List<int> RowsId);

    }
}
