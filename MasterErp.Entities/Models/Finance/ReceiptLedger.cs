using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Finance
{
    [Table("ReceiptLedgers", Schema = "Finance")]

    public class ReceiptLedger : CreatorModel
    {
        public int ReceiptLedgerId { get; set; }
        public string Code { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public int StartReceiptNumber { get; set; }
        public int PeriodId { get; set; }
        public int ReceiptLedgerTypeId { get; set; }
        public int OperationTypeId { get; set; }
        public bool IsActive { get; set; }
        public bool IsLocked { get; set; }
        public string Notes { get; set; }
    }
}

















