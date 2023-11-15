using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common.Finance.Purchases
{
    public class SupplierReturnsVoucherModel
    {
        public int? SupplierReturnsVoucherId { get; set; }
        public int? InvoiceNumber { get; set; }
        public int SupplierId { get; set; }
        //public int BranchId { get; set; }
        public double TotalValue { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public string Notes { get; set; }
        public string UserId { get; set; }
        public List<ItemModel> Items { get; set; }
    }
}
