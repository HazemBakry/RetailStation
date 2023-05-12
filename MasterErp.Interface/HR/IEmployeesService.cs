using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.HR
{
    public interface IEmployeesService
    {
        List<IqamaIssuePlace> GetIqamaIssuePlaceData();
        List<PassportIssuePlace> GetPassportIssuePlaceData();
        List<Sponsor> GetSponsorData();
        List<IqamaJob> GetIqamaJobData();
        List<Nationality> GetNationalityData();
        List<Job> GetJobData();
        List<Branch> GetBranchData();
        List<Bank> GetBankData();
        bool AddNewEmployee(SaveEmployeeModel model);
    }
}
