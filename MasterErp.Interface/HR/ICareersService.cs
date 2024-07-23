using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.HR
{
    public interface ICareersService
    {
        List<EmployeeCareerDto> GetAllEmployeeCareers(SearchFilterModel SearchModel);
        List<EmployeeCareerDto> GetCareersByEmployeeId(int EmployeeId, SearchFilterModel SearchModel);
        ActionsResponseModel AddNewEmployeeCareer(int EmployeeId, EmployeeCareerDto model);
        ActionsResponseModel EditEmployeeCareer(int EmployeeId, EmployeeCareerDto model);
        ActionsResponseModel DeleteEmployeeCareer(int CareerId);
        List<SelectorDataModel> GetWorkStatusSelector();
        List<SelectorDataModel> GetJobsSelector();
    }
}
