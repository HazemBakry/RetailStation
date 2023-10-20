using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class ReceiptLedger
    {
        public int ReceiptLedgerId { get; set; }
        public int StartReceiptNumber { get; set; }
        public int PeriodId { get; set; }
        public int ReceiptLedgerTypeId { get; set; }
        public int OperationTypeId { get; set; }
        public bool IsActive { get; set; }
        public bool IsLocked { get; set; }
        public string Code { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string Notes { get; set; }
        public string InsertUser { get; set; }
        public string UpdateUser { get; set; }
        public DateTime InsertDate { get; set; }
        public DateTime? UpdateDate { get; set; }
    }
}

















