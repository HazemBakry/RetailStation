using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common
{
    public class OrderModel: CreatorModel
    {
        public int? OrderId { get; set; }
        public int OrderNumber { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime? DueDate { get; set; }
        public int? SupplierId { get; set; }
        public double TotalValue { get; set; }
        public string Notes { get; set; }
        public bool? IsLocked { get; set; }
        public bool? IsCancelled { get; set; }
        public List<OrderProductModel> OrderProducts { get; set; }
    }

    public class OrderProductModel
    {
        public int ItemId { get; set; }
        public string ItemNameAr { get; set; }
        public string ItemNameEn { get; set; }
        public int UnitId { get; set; }
        public string UnitNameAr { get; set; }
        public string UnitNameEn { get; set; }
        public double Price { get; set; }
        public double Quantity { get; set; }
        public double TotalValue { get; set; }
        public bool? IsActive { get; set; }
    }
}
