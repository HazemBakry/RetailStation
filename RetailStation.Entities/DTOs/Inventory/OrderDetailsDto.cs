using RetailStation.Entities.DTOs.Purchases;
using RetailStation.Entities.Models;
using RetailStation.Entities.Models.Inventory;
using RetailStation.Entities.Models.Purchases;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Inventory
{
    public class OrderDetailsReportModel
    {
        public int? ItemId { get; set; }
        public string Code { get; set; }
        public string Barcode { get; set; }
        public string ItemNameAR { get; set; }
        public string ItemNameEN { get; set; }
        public string CategoryNameAR { get; set; }
        public string CategoryNameEN { get; set; }
        public double? Price { get; set; }
        public double? Quantity { get; set; }
        public double? TotalValue { get; set; }

        public int? TotalCount { get; set; }

    }  
    public class OrderReportModel: OrderDetailsReportModel
    {
        public int? OrderNumber { get; set; }
        public DateTime? OrderDate { get; set; }
        public int? SupplierId { get; set; }
        public string SerialNumber { get; set; }
        public string DocNumber { get; set; }
        public string SupplierNameAR { get; set; }
        public string SupplierNameEN { get; set; }
        public int? StoreId { get; set; }
        public int? WorkflowStatusId { get; set; }
        public string StoreNameAR { get; set; }
        public string StoreNameEN { get; set; }
        public string WorkflowStatusNameAR { get; set; }
        public string WorkflowStatusNameEN { get; set; }
        public string PurchaseOrder { get; set; }
        public string PurchaseInvoice { get; set; }
    }
    public class OrderReportExportModel
    {
        [JsonProperty("Code")]
        [DisplayName("Code")]
        public string Code { get; set; }

        [JsonProperty("Barcode")]
        [DisplayName("Barcode")]
        public string Barcode { get; set; }

        [JsonProperty("Item Name")]
        [DisplayName("Item Name")]
        public string ItemName { get; set; }

        [JsonProperty("Category Name")]
        [DisplayName("Category Name")]
        public string CategoryName { get; set; }

        [JsonProperty("Order Number")]
        [DisplayName("Order Number")]
        public int? OrderNumber { get; set; }
        [JsonProperty("Serial Number")]
        public string SerialNumber { get; set; }

        [JsonProperty("Order Date")]
        [DisplayName("Order Date")]
        public string OrderDate { get; set; }

        [JsonProperty("Price")]
        [DisplayName("Price")]
        public double? Price { get; set; }

        [JsonProperty("Quantity")]
        [DisplayName("Quantity")]
        public double? Quantity { get; set; }

        [JsonProperty("Supplier Name")]
        [DisplayName("Supplier Name")]
        public string SupplierName { get; set; }
    }    
    public class OrderDetailsReportExportModel
    {
        [JsonProperty("Code")]
        [DisplayName("Code")]
        public string Code { get; set; }

        [JsonProperty("Barcode")]
        [DisplayName("Barcode")]
        public string Barcode { get; set; }

        [JsonProperty("Item Name")]
        [DisplayName("Item Name")]
        public string ItemName { get; set; }

        [JsonProperty("Category Name")]
        [DisplayName("Category Name")]
        public string CategoryName { get; set; }

        public double? Price { get; set; }

        [JsonProperty("Quantity")]
        [DisplayName("Quantity")]
        public double? Quantity { get; set; }
        [JsonProperty("Total Value")]
        [DisplayName("Total Value")]
        public double? TotalValue { get; set; }
    }    
    public class MaterialReciptReportExportModel
    {
       

        [JsonProperty("Order Number")]
        [DisplayName("Order Number")]
        public int? OrderNumber { get; set; }
        [JsonProperty("Serial Number")]
        public string SerialNumber { get; set; }

        [JsonProperty("Order Date")]
        [DisplayName("Order Date")]
        public string OrderDate { get; set; }
        public string DocNumber { get; set; }
        [JsonProperty("Supplier Name")]
        [DisplayName("Supplier Name")]
        public string SupplierName { get; set; }
        [JsonProperty("Store Name")]
        public string StoreName { get; set; }
        [JsonProperty("Total Value")]
        [DisplayName("Total Value")]
        public double? TotalValue { get; set; }

        [JsonProperty("Purchase Order")]
        public string PurchaseOrder { get; set; }
        [JsonProperty("Purchase Invoice")]
        public string PurchaseInvoice { get; set; }

        [JsonProperty("Status")]
        public string Status { get; set; }
    }
}
