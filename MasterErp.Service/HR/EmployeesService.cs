using MasterErp.Entities.Models;
using MasterErp.Interface.HR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.HR
{
    public class EmployeesService: IEmployeesService
    {
        private readonly DBContext Context;

        public EmployeesService(DBContext dbContext)
        {
            Context = dbContext;
        }

        public List<IqamaIssuePlace> GetIqamaIssuePlaceData()
        {
            var results = Context.IqamaIssuePlace.ToList();
            return results;
        }

        public List<Sponsor> GetSponsorData()
        {
            var results = Context.Sponsor.ToList();
            return results;
        }

        public List<IqamaJob> GetIqamaJobData()
        {
            var results = Context.IqamaJob.ToList();
            return results;
        }

        public List<Nationality> GetNationalityData()
        {
            var results = Context.Nationalitie.ToList();
            return results;
        }

        public List<Job> GetJobData()
        {
            var results = Context.Job.ToList();
            return results;
        }

        public List<Branch> GetBranchData()
        {
            var results = Context.Branche.ToList();
            return results;
        }

        public List<Bank> GetBankData()
        {
            var results = Context.Bank.ToList();
            return results;
        }
    }
}
