using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class PurchaseInvoiceType
    {
        [Key]
        public int InvoiceTypeId { get; set; }
        public int? DebitId { get; set; }
        public int? CreditId { get; set; }
        public string NameEN { get; set; }
        public string NameAR { get; set; }
        public string Notes { get; set; }
        public bool IsBindToGeneralAccounting { get; set; }
        public bool? IsActive { get; set; }
        public string InsertUser { get; set; }
        public DateTime? InsertDate { get; set; }
        public string UpdateUser { get; set; }
        public DateTime? UpdateDate { get; set; }
    }
}
