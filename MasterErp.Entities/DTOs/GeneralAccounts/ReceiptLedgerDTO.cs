using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.GeneralAccounts
{
    public class ReceiptLedgerDTO: CreatorModel
    {
        public int ReceiptLedgerId { get; set; }
        public int StartReceiptNumber { get; set; }
        public int PeriodId { get; set; }
        public int ReceiptLedgerTypeId { get; set; }
        public string ReceiptLedgerType { get; set; }
        public int OperationTypeId { get; set; }
        public string OperationType { get; set; }
        public bool IsActive { get; set; }
        public bool IsLocked { get; set; }
        public string Code { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string PeriodName { get; set; }
        public string Notes { get; set; }
        public int? TotalCount { get; set; }
    }
}
