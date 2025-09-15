using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Website
{
    public class PaymentReceiptModel:CreatorModel
    {

        public int? PaymentReceiptId { get; set; }
        public int? ReceiptNumber { get; set; }
        public int PaymentTypeId { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public string ContactName { get; set; }
        public int? FromAccountId { get; set; }
        public int? ToAccountId { get; set; }
        public int? SupplierId { get; set; }
        public decimal MoneyAmount { get; set; }
        public int? WorkflowStatusId { get; set; }
        public int? JournalEntryId { get; set; }
        public string DocNumber { get; set; }
        public int? CurrencyId { get; set; }
        public string Description { get; set; }
        public string PaymentTypeName { get; set; }
        public string ChequeNumber { get; set; }
        public string SupplierName { get; set; }
        public string Currency { get; set; }
        public string WorkflowStatusNameEN { get; set; }
        public string WorkflowStatusNameAR { get; set; }
        public int? TotalCount { get; set; }
        public int? NextId { get; set; }
        public int? PreviousId { get; set; }
    }
}
