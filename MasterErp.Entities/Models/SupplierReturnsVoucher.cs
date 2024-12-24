using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class SupplierReturnsVoucher: CreatorModel
    {
        public int SupplierReturnsVoucherId { get; set; }
        public int InvoiceNumber { get; set; }
        public string DocNumber { get; set; }
        public DateTime InvoiceDate { get; set; }
        public int SupplierId { get; set; }
        public double TotalValue { get; set; }
        public string Notes { get; set; }
        public bool? IsLocked { get; set; }
        public bool? IsCancelled { get; set; }
    }
}
