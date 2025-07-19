using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Finance
{
    [Table("PaymentReceipts", Schema = "Finance")]
    public class PaymentReceipt : CreatorModel
    {
        [Key]
        public int PaymentReceiptId { get; set; }
        public int? ReceiptNumber { get; set; }
        public int? PaymentOrderId { get; set; }
        public int PaymentTypeId { get; set; }
        public int? ReceiptTypeId { get; set; }
        public int? ReceiptLedgerId { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string ContactName { get; set; }
        public int? BankAccountId { get; set; }
        public int? FromAccountId { get; set; }
        public int? SafeId { get; set; }
        public int? AgencyTypeId { get; set; }
        public int? AccountId { get; set; }
        public int? SupplierId { get; set; }
        public int? CustomerId { get; set; }
        public int? EmployeeId { get; set; }
        public double MoneyAmount { get; set; }
        public int? WorkflowStatusId { get; set; }
        public int JournalEntryId { get; set; }
        public string DocNumber { get; set; }
        public int? CurrencyId { get; set; }
        public string Description { get; set; }

    }
}
