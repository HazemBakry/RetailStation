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
    public interface IOverTimeService
    {
        List<EmployeeOverTimeDto> GetAllEmployeeOverTime(SearchFilterModel SearchModel);
        List<EmployeeOverTimeDto> GetOverTimeByEmployeeId(int EmployeeId, SearchFilterModel SearchModel);
        ActionsResponseModel AddNewEmployeeOverTime(int EmployeeId, EmployeeOverTimeDto model);
        ActionsResponseModel EditEmployeeOverTime(int EmployeeId, EmployeeOverTimeDto model);
        ActionsResponseModel DeleteEmployeeOverTime(int OverTimeId);
    }
}
