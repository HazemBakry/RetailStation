using RetailStation.Entities.Common;
using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Inventory
{
    public class GeneralOrderModel: CreatorModel
    {
        public int? OrderId { get; set; }
        public int? OrderNumber { get; set; }
        public string SerialNumber { get; set; }
        public string DocNumber { get; set; }
        public DateTime? OrderDate { get; set; }
        public DateTime? DueDate { get; set; }
        public string OrderStatus { get; set; }
        public string StatusNameAR { get; set; }
        public string StatusNameEN { get; set; }
        public int? StatusId { get; set; }
        public int? OrderTypeId { get; set; }
        public string OrderTypeNameAR { get; set; }
        public string OrderTypeNameEN { get; set; }
        public string Notes { get; set; }
        public bool? IsLocked { get; set; }
        public bool? IsCancelled { get; set; }
        public string WorkflowStatusNameEN { get; set; }
        public string WorkflowStatusNameAR { get; set; }
        public int? WorkflowStatusId { get; set; }
        public double? TotalValue { get; set; } = 0;


    }

    public class GeneralOrderDetailsModel
    {
        public int ItemId { get; set; }
        public string ItemNameAR { get; set; }
        public string ItemNameEN { get; set; }
        public int? UnitId { get; set; }
        public string UnitNameAR { get; set; }
        public string UnitNameEN { get; set; }
        public double? Price { get; set; }
        public double Quantity { get; set; }
        public double TotalValue { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? ExpireDate { get; set; }
        public int? OrderId { get; set; }
    }

}
