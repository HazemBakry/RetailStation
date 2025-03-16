using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Purchases
{
    [Table("PurchaseInvoiceTypes", Schema = "Purchase")]

    public class PurchaseInvoiceType : CreatorModel
    {
        [Key]
        public int PurchaseInvoiceTypeId { get; set; }
        public int? AccountDebitId { get; set; }
        public int? AccountCreditId { get; set; }
        public string NameEN { get; set; }
        public string NameAR { get; set; }
        public string Notes { get; set; }
        public bool IsBindToGeneralAccounting { get; set; }
        public bool? IsActive { get; set; }
    }
}
