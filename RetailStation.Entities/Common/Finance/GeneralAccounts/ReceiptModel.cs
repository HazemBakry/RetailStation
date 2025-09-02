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
        public int? ReceiptId { get; set; }
        public int? ReceiptNumber { get; set; }
        public int? OrderNumber { get; set; }
        public int? ReceiptLedgerId { get; set; }
        public int PaymentTypeId { get; set; }
        public int? JournalEntryId { get; set; }
        public int? CurrencyId { get; set; }
        public int? ReceiptTypeId { get; set; }
        public int? BankAccountId { get; set; }
        public int? CustomerId { get; set; }
        public int? EmployeeId { get; set; }
        public int? AgencyTypeId { get; set; }
        public int? FromAccountId { get; set; }
        public int? AccountId { get; set; }
        public int? SupplierId { get; set; }
        public int? PaymentOrderId { get; set; }
        public string PaymentTypeName { get; set; }
        public string ReceiptTypeName { get; set; }
        public string ReceiptLedgerName { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string ContactName { get; set; }
        public string BankAccount { get; set; }
        public string ChequeNumber { get; set; }
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
        public string WorkflowStatusNameEN { get; set; }
        public string WorkflowStatusNameAR { get; set; }
        public int? WorkflowStatusId { get; set; }
        public int? EntryId { get; set; }
        public int? EmployeeAdvanceId { get; set; }
        public int? EmployeeDueId { get; set; }
        public int? TotalCount { get; set; }

        public int? NextId { get; set; }
        public int? PreviousId { get; set; }
    }
}
