using MasterErp.Entities.Models;
using MasterErp.Entities.Models.HR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common
{
    public class SaveEmployeeModel
    {
        public Employee Employee { get; set; }
        public ContractDetail ContractDetail { get; set; }
        public Contract EmployeeContract { get; set; }
    }
}
