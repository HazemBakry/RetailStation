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
        List<EmployeeVacation> GetEmployeeVacations(SearchFilterModel model);
        bool AddNewVacation(Vacation model);
        bool EditVacation(Vacation model);
        bool DeleteVacation(int VacationId);
    }
}
