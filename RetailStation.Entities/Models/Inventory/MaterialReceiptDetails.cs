using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Inventory
{
    [Table("MaterialReceiptDetails", Schema = "Inventory")]

    public class MaterialReceiptDetails
    {
        [Key]
        public int MaterialReceiptDetailsId { get; set; }
        public int MaterialReceiptId { get; set; }
        public int ItemId { get; set; }
        public int? UnitId { get; set; }
        public double Price { get; set; }
        public double Quantity { get; set; }
        public double TotalValue { get; set; }
        public DateTime? ExpireDate { get; set; }
        //public double? ItemBalance { get; set; }
        //public double? RemainQuantity { get; set; }
        //public bool? IsLocked { get; set; }
        public string Notes { get; set; }
    }
}
