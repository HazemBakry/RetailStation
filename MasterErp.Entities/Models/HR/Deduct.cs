using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.HR
{
    public class Deduct : CreatorModel
    {
        public int DeductId { get; set; }
        public int EmployeeId { get; set; }
        public int DeductTypeId { get; set; }
        public double MoneyAmount { get; set; }
        public DateTime ExecutionDate { get; set; }
        public bool? IsApproved { get; set; }
        public string Notes { get; set; }


    }
}
