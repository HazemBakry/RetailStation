using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common.Finance.Purchases
{
    public class SupplierStatementModel
    {

        public int? OrderId { get; set; }
        public int? OrderNumber { get; set; }
        public int? SupplierId { get; set; }
        public string SupplierName { get; set; }
        public string OrderType { get; set; }
        public DateTime? OrderDate { get; set; }
        public string Description { get; set; }
        public double? Credit { get; set; }
        public double? Debit { get; set; }
        public double? Balance { get; set; }
    }
}
