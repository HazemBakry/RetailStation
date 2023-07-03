using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common
{
    public class SalesInvoiceModel
    {
        public int? SalesInvoiceId { get; set; }
        public string InvoiceNumber { get; set; }
        public int BranchId { get; set; }
        public string Notes { get; set; }
        public int? UserId { get; set; }
        public List<SalesInvoiceDetails> Items { get; set; }
    }
}
