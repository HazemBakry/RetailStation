using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Common
{
    public class OrderModel: CreatorModel
    {
        public int? OrderId { get; set; }
        public int? SecondaryOrderId { get; set; }
        public List<int> SecondaryOrderIds { get; set; }
        public int? OrderNumber { get; set; }
        public string DocNumber { get; set; }
        public DateTime? OrderDate { get; set; }
        public DateTime? DueDate { get; set; }
        public string OrderStatus { get; set; }
        public string StatusNameAR { get; set; }
        public string StatusNameEN { get; set; }
        public int? StatusId { get; set; }
        public int? OrderTypeId { get; set; }
        public string OrderTypeAR { get; set; }
        public string OrderTypeEN { get; set; }
        public int? SupplierId { get; set; }
        public string SupplierNameAR { get; set; }
        public string SupplierNameEN { get; set; }
        public int? BranchId { get; set; }
        public string BranchNameAR { get; set; }
        public string BranchNameEN { get; set; }
        public int? StoreId { get; set; }
        public string StoreNameAR { get; set; }
        public string StoreNameEN { get; set; }
        public double? SubTotal { get; set; }
        public double? Tax { get; set; }
        public double? TaxPercent { get; set; }
        public double? Discount { get; set; }
        public double? DiscountPercent { get; set; }
        public double TotalValue { get; set; }
        public double? NetValue { get; set; }
        public string Notes { get; set; }
        public bool? IsLocked { get; set; }
        public bool? IsCancelled { get; set; }
        public int? TotalCount { get; set; }
        public int? PurchaseOrderId { get; set; }
        public int? ReceiveOrderId { get; set; }
        public List<OrderProductModel> OrderProducts { get; set; }
    }

    public class OrderProductModel
    {
        public int ItemId { get; set; }
        public string ItemNameAR { get; set; }
        public string ItemNameEN { get; set; }
        public int? UnitId { get; set; }
        public string UnitNameAR { get; set; }
        public string UnitNameEN { get; set; }
        public double Price { get; set; }
        public double Quantity { get; set; }
        public double TotalValue { get; set; }
        public bool? IsActive { get; set; }
        public int? PurchaseOrderId { get; set; }
        public int? OrderId { get; set; }

    }
}
