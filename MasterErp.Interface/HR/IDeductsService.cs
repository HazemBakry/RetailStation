using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.HR
{
    public interface IDeductsService
    {
        List<EmployeeDeductDto> GetAllEmployeeDeducts(SearchFilterModel SearchModel);
        List<EmployeeDeductDto> GetDeductsByEmployeeId(int EmployeeId, SearchFilterModel SearchModel);
        ActionsResponseModel AddNewEmployeeDeduct(int EmployeeId, EmployeeDeductDto model);
        ActionsResponseModel EditEmployeeDeduct(int EmployeeId, EmployeeDeductDto model);
        ActionsResponseModel DeleteEmployeeDeduct(int DeductId);
        List<SelectorDataModel> GetDeductTypesSelector();
    }
}
