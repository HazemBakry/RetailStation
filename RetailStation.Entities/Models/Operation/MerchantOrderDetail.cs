using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Operation
{
    public class MerchantOrderDetail
    {
        public int MerchantOrderDetailId { get; set; }
        public int MerchantOrderId { get; set; }
        public int ItemId { get; set; }
        public int? UnitId { get; set; }
        public double Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal SubTotal { get; set; }
        public decimal Discount { get; set; }
        public decimal DiscountPercent { get; set; }
        public decimal TotalValue { get; set; }
        public string Notes { get; set; }
    }

}
