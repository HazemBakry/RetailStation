using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.HR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.HR
{
    public interface ICareersService
    {
        List<EmployeeCareerDto> GetAllEmployeeCareers(SearchFilterModel SearchModel);
        List<EmployeeCareerDto> GetCareersByEmployeeId(int EmployeeId, SearchFilterModel SearchModel);
        ActionsResponseModel AddNewEmployeeCareer(int EmployeeId, EmployeeCareerDto model);
        ActionsResponseModel EditEmployeeCareer(int EmployeeId, EmployeeCareerDto model);
        ActionsResponseModel DeleteEmployeeCareer(int EmployeeCareerId);
        List<SelectorDataModel> GetWorkStatusSelector();
        List<SelectorDataModel> GetJobsSelector();
    }
}
