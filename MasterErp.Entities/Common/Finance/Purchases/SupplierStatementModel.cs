using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common.Finance.Purchases
{
    public class SupplierStatementModel
    {

        public int? SupplierStatementId { get; set; }
        public int? SupplierId { get; set; }
        public bool? IsOpeningBalance { get; set; }
        public DateTime? Date { get; set; }
        public string SupplierName { get; set; }
        public string Description { get; set; }
        public double? Credit { get; set; }
        public double? Debit { get; set; }
        public double? Balance { get; set; }
    }
}
