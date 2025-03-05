using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common.Finance.GeneralAccounts
{
    public class ReceiptModel : CreatorModel
    {
        public int PaymentReceiptId { get; set; }
        public int? ReceiptNumber { get; set; }
        public int? OrderNumber { get; set; }
        public int? PaymentOrderId { get; set; }
        public string PaymentTypeName { get; set; }
        public string ReceiptTypeName { get; set; }
        public string ReceiptLedgerName { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string ContactName { get; set; }
        public string BankAccount { get; set; }
        public string ChequeNumber { get; set; }
        public string Safe { get; set; }
        public string AgencyTypeName { get; set; }
        public string AccountName { get; set; }
        public string AccountNumber { get; set; }
        public string SupplierName { get; set; }
        public string CustomerName { get; set; }
        public string EmployeeName { get; set; }
        public double MoneyAmount { get; set; }
        public string DocNumber { get; set; }
        public string Currency { get; set; }
        public string Description { get; set; }
        public bool? IsLocked { get; set; }
        public bool? IsCancelled { get; set; }
        public int? EntryId { get; set; }
        public int? TotalCount { get; set; }

    }
}
