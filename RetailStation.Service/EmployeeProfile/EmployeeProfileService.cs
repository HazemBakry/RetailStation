using MasterErp.Entities.Models;
using MasterErp.Interface.EmployeeProfile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.EmployeeProfile
{
    public class EmployeeProfileService : IEmployeeProfileService
    {
        private readonly DBContext Context;

        public EmployeeProfileService(DBContext context)
        {
            Context = context;
        }

    }
}
