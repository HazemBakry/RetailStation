using RetailStation.Entities.Models;
using RetailStation.Entities.Models.HR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Common
{
    public class SaveEmployeeModel
    {
        public Employee Employee { get; set; }
        public ContractDetail ContractDetail { get; set; }
        public Contract EmployeeContract { get; set; }
    }
}
