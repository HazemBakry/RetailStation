using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.HR
{
    public interface ISickLeaveService
    {
        List<EmployeeSickLeaveDto> GetAllEmployeeSickLeaves(SearchFilterModel SearchModel);
        List<EmployeeSickLeaveDto> GetSickLeavesByEmployeeId(int EmployeeId, SearchFilterModel SearchModel);
        ActionsResponseModel AddNewEmployeeSickLeave(int EmployeeId, EmployeeSickLeaveDto model);
        ActionsResponseModel EditEmployeeSickLeave(int EmployeeId, EmployeeSickLeaveDto model);
        ActionsResponseModel DeleteEmployeeSickLeave(int SickLeaveId);
    }
}
