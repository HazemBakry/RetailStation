using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.HR
{
    public class EmployeeLoanDto : CreatorModel
    {
        public int? LoanId { get; set; }
        public int? EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public string LoanTypeName { get; set; }
        public int LoanTypeId { get; set; }
        public double LoanAmount { get; set; }
        public double PaymentAmount { get; set; }
        public DateTime PaymentFromDate { get; set; }
        public DateTime? PaymentToDate { get; set; }
        public bool? IsApproved { get; set; }
        public string Notes { get; set; }
        public int? TotalCount { get; set; }


    }
}
