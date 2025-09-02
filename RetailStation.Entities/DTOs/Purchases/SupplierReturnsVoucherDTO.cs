using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Purchases
{
    public class SupplierReturnsVoucherDTO
    {
        public int SupplierReturnsVoucherId { get; set; }
        public int InvoiceNumber { get; set; }
        public DateTime InvoiceDate { get; set; }
        public int SupplierId { get; set; }
        public double TotalValue { get; set; }
        public string Notes { get; set; }
        //public string BranchName { get; set; }
        public string SupplierName { get; set; }
        public bool? IsLocked { get; set; }
        public bool? IsCancelled { get; set; }
        public string InsertUser { get; set; }
        public DateTime? InsertDate { get; set; }
        public string UpdateUser { get; set; }
        public DateTime? UpdateDate { get; set; }
    }
}
