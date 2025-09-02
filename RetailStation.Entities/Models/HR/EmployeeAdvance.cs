using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.HR
{

    [Table("EmployeeAdvances", Schema = "HR")]

    public class EmployeeAdvance : CreatorModel
    {
        public int EmployeeAdvanceId { get; set; }
        public int EmployeeId { get; set; }
        public int AdvanceNumber { get; set; }
        public int AdvanceTypeId { get; set; }
        public string AdvanceName { get; set; }
        public double AdvanceAmount { get; set; }
        public double PaymentAmount { get; set; }
        public double? Benefit { get; set; }
        public DateTime PaymentFromDate { get; set; }
        public DateTime PaymentToDate { get; set; }
        public int? WorkflowStatusId { get; set; }
        public string Notes { get; set; }


    }
}
