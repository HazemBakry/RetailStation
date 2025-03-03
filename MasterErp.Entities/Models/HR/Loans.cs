using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.HR
{
    [Table("Loans", Schema = "HR")]

    public class Loans : CreatorModel
    {
        [Key]
        public int LoanId { get; set; }
        public string LoanName { get; set; }
        public double LoanAmount { get; set; }
        public DateTime Date { get; set; }
        public int Bnefit { get; set; }
        public int Duration { get; set; }
        public double AmountDue { get; set; }
        public double MonthlyInstallment { get; set; }
    }
}
