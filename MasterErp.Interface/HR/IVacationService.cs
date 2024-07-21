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
    public interface IVacationService
    {
 
        List<EmployeeVacationDto> GetAllEmployeeVacationsData(SearchFilterModel SearchModel);
        List<EmployeeVacationDto> GetVacationsByEmployeeId(int EmployeeId,SearchFilterModel SearchModel);
        ActionsResponseModel AddNewEmployeeVacation(int EmployeeId, EmployeeVacationDto model);
        ActionsResponseModel EditVacation(int EmployeeId, EmployeeVacationDto model);
        List<SelectorDataModel> GetVacationTypesSelector();
        ActionsResponseModel DeleteVacation(int VacationId);
    }
}
