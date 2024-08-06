using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.HR
{
    public class Loan : CreatorModel
    {
        public int LoanId { get; set; }
        public int EmployeeId { get; set; }
        public int LoanTypeId { get; set; }
        public double LoanAmount { get; set; }
        public double PaymentAmount { get; set; }
        public DateTime PaymentFromDate { get; set; }
        public DateTime PaymentToDate { get; set; }
        public bool? IsApproved { get; set; }
        public string Notes { get; set; }


    }
}
