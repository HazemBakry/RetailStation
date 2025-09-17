using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Website
{

    [Table("OrderDetails", Schema = "Website")]

    public class OrderDetail
    {
        public int OrderDetailId { get; set; }
        public int OrderId { get; set; }
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
