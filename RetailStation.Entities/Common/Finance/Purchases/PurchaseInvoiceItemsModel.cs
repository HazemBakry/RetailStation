using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;

namespace RetailStation.Entities.Common.Finance.Purchases
{
    public class PurchaseInvoiceItemsModel
    {
        public int? PurchaseInvoiceId { get; set; }
        public int InvoiceNumber { get; set; }
        public int SupplierId { get; set; }
        //public int BranchId { get; set; }
        public int InvoiceTypeId { get; set; }
        public string Notes { get; set; }
        public string SupplierNameAR { get; set; }
        public string SupplierNameEN { get; set; }
        public double TotalValue { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public string ItemNameAR { get; set; }
        public string ItemNameEN { get; set; }
        public int PurchaseInvoiceDetailsId { get; set; }
        public int ItemId { get; set; }
        public double Quantity { get; set; }
        public double Price { get; set; }
        public double ItemTotalValue { get; set; }
        public int? UnitId { get; set; }
        public string UnitNameAr { get; set; }
        public string UnitNameEn { get; set; }

    }
    public class PurchaseInvoiceItemsDetails
    {

        public string ItemNameAR { get; set; }
        public string ItemNameEN { get; set; }
        public int PurchaseInvoiceDetailsId { get; set; }
        public int PurchaseInvoiceId { get; set; }
        public int ItemId { get; set; }
        public double Quantity { get; set; }
        public double Price { get; set; }
        public double ItemTotalValue { get; set; }
        public double? Discount { get; set; }
        public int UnitID { get; set; }
        public double? Tax { get; set; }
        public double? NetValue { get; set; }
        public DateTime? ProductionDate { get; set; }
        public DateTime? ExpireDate { get; set; }
        public string Notes { get; set; }
    }
}
