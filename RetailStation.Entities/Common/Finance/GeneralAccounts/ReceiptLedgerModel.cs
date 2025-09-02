using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Common.Finance.GeneralAccounts
{
    public class ReceiptLedgerModel : CreatorModel
    {
        public int? ReceiptLedgerId { get; set; }
        public int StartReceiptNumber { get; set; }
        public int FinancialPeriodId { get; set; }
        public int ReceiptLedgerTypeId { get; set; }
        public int PaymentTypeId { get; set; }
        public bool IsActive { get; set; }
        public bool IsLocked { get; set; }
        public string Code { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string Notes { get; set; }


        public string FinancialPeriodNameEN { get; set; }
        public string FinancialPeriodNameAR { get; set; }
        public string ReceiptLedgerTypeNameEN { get; set; }
        public string ReceiptLedgerTypeNameAR { get; set; }
        public string PaymentTypeNameEN { get; set; }
        public string PaymentTypeNameAR { get; set; }

        public int? TotalCount { get; set; }
    }
}
