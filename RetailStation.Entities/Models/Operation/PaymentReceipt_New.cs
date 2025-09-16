using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Operation
{

    [Table("PaymentReceipts", Schema = "Supplier")]
    public class PaymentReceipt_New : CreatorModel
    {
        [Key]
        public int PaymentReceiptId { get; set; }
        public int? ReceiptNumber { get; set; }
        public int PaymentTypeId { get; set; }
        public DateTime ReleaseDate { get; set; }
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

    }
}
