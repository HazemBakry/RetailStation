using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.HR
{

    public class LoansPayment : CreatorModel
    {
        public int LoansPaymentId { get; set; }
        public int LoanId { get; set; }
        public int EmployeeId { get; set; }
        public double MoneyAmount { get; set; }
        public DateTime ExecutionDate { get; set; }
        public bool IsPayed { get; set; }
        public string Notes { get; set; }


    }
}
