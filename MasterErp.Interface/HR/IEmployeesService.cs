using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.HR
{
    public interface IEmployeesService
    {
        List<EmployeesModel> GetAllEmployees();
        List<IqamaIssuePlace> GetIqamaIssuePlaceData();
        List<PassportIssuePlace> GetPassportIssuePlaceData();
        List<Sponsor> GetSponsorData();
        List<IqamaJob> GetIqamaJobData();
        List<Nationality> GetNationalityData();
        List<Job> GetJobData();
        List<Branch> GetBranchData();
        List<Bank> GetBankData();
        DataTable GetAllEmployeeSalary();
        bool EditEmployeeSalary(EmployeeSalary model);
        bool AddNewEmployee(SaveEmployeeModel model);
    }
}
