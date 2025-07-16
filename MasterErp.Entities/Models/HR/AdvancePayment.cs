using MasterErp.Entities.Common.Enums;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.HR
{
    
    [Table("AdvancePayments", Schema = "HR")]

    public class AdvancePayment : CreatorModel
    {
        public int AdvancePaymentId { get; set; }
        public int EmployeeAdvanceId { get; set; }
        public double MoneyAmount { get; set; }
        public DateTime ExecutionDate { get; set; }
        public int? WorkflowStatusId { get; set; } = (int)WorkflowStatus.Pending;
        public string Notes { get; set; }


    }
}
