using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.HR
{
    [Table("EmployeeFinancialCustody", Schema = "HR")]

    public class EmployeeFinancialCustody : CreatorModel
    {
        [Key]
        public int EmployeeFinancialCustodyId { get; set; }
        public int EmployeeId { get; set; }
        public int FinancialCustodyTypeId { get; set; }
        public decimal MoneyAmount { get; set; }
        public DateTime ExecutionDate { get; set; }
        public int? WorkflowStatusId { get; set; }
        public string Notes { get; set; }
    }
}
