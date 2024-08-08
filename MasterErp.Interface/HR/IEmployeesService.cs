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
    public interface IEmployeeService
    {
        List<EmployeeBasicInfo> GetAllEmployees(SearchFilterModel model, int? ManagerId = null);
        List<EmployeesSummary> GetEmployeesSummary();
        List<SelectorDataModel> GetActiveEmployeesSelector();
        List<EmployeeRequest> GetEmployeeRequests_Data(SearchFilterModel model);
        List<IqamaIssuePlace> GetIqamaIssuePlaces();
        List<PassportIssuePlace> GetPassportIssuePlaces();
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
