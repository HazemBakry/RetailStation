using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{

    public class PurchaseReturns
    {
        public int PurchaseReturnsID { get; set; }
        public int SupplierReturnsVoucherID { get; set; }
        public int InvoiceTypeID { get; set; }
        public string InvoiceNumber { get; set; }
        public DateTime InvoiceDate { get; set; }
        public DateTime? ReturnsDate { get; set; }
        public int SupplierID { get; set; }
        public double PurchaseInvoiceTotal{ get; set; }
        public double ReturnsInvoiceTotal{ get; set; }
        public string Notes { get; set; }
        public string InsertUser { get; set; }
        public DateTime? InsertDate { get; set; }
        public string UpdateUser { get; set; }
        public DateTime? UpdateDate { get; set; }


    }
}
