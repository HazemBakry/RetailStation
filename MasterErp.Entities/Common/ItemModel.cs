using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common
{
    public class ItemModel
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
        public string InsertUser { get; set; }
        public DateTime? InsertDate { get; set; }

    }
}
