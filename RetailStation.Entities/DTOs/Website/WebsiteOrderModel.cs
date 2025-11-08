using Microsoft.AspNetCore.Http;
using RetailStation.Entities.DTOs.Operation;
using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Website
{
    public class WebsiteOrderModel : CreatorModel
    {
        public int? OrderId { get; set; }
        public int? OrderNumber { get; set; }
        public string SerialNumber { get; set; }
        public string SubscriberId { get; set; }
        public string DocNumber { get; set; }
        public DateTime? OrderDate { get; set; }
        public DateTime? DueDate { get; set; }
        public string WorkflowStatusNameAR { get; set; }
        public string WorkflowStatusNameEN { get; set; }
        public int? WorkflowStatusId { get; set; }
        public int? OrderTypeId { get; set; }
        public string OrderTypeAR { get; set; }
        public string OrderTypeEN { get; set; }
        public int? MerchantId { get; set; }
        public string MerchantNameAR { get; set; }
        public string MerchantNameEN { get; set; }
        public int? BranchId { get; set; }
        public string BranchNameAR { get; set; }
        public string BranchNameEN { get; set; }
        public int? StoreId { get; set; }
        public string StoreNameAR { get; set; }
        public string StoreNameEN { get; set; }
        public int? PaymentTypeId { get; set; }
        public string PaymentTypeNameAR { get; set; }
        public string PaymentTypeNameEN { get; set; }
        public decimal? DeliveryValue { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? Tax { get; set; }
        public decimal? TaxPercent { get; set; }
        public decimal? Discount { get; set; }
        public decimal? DiscountPercent { get; set; }
        public decimal TotalValue { get; set; }
        public decimal? NetValue { get; set; }
        public string Notes { get; set; }
        public int? TotalCount { get; set; }
        public int? PaymentOrderId { get; set; }
        public List<WebsiteOrderItemModel> Items { get; set; }
    }
    public class WebsiteOrderItemModel
    {
        public int? OrderDetailId { get; set; }
        public int? OrderId { get; set; }
        public int? MerchantItemId { get; set; }

        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string Image { get; set; }
        public int ItemId { get; set; }
        public int? UnitId { get; set; }
        public double Quantity { get; set; }
        public decimal? Price { get; set; }
        public decimal SubTotal { get; set; }
        public decimal? Discount { get; set; }
        public decimal? DiscountPercent { get; set; }
        public decimal TotalValue { get; set; }
        public string Notes { get; set; }
        public string ItemNameAR { get; set; }
        public string ItemNameEN { get; set; }
        public string UnitName { get; set; }
        public int? PurchaseUnitId { get; set; }
        public string PurchaseUnitName { get; set; }
        public int? ItemCategoryId { get; set; }
        public string ItemCategoryName { get; set; }
        public bool IsActive { get; set; }
        public int? ItemTypeId { get; set; }
        public int? MerchantId { get; set; }
        public string MerchantNameAR { get; set; }
        public string MerchantNameEN { get; set; }
        public string ImageUrl { get; set; }
        public int? TotalCount { get; set; }
    }
}
