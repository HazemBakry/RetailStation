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
        public string NameEN { get; set; }
        public string NameAR { get; set; }
        public int UnitId { get; set; }
        public double Cost { get; set; }
        public double Quantity { get; set; }
        public double Price => Cost;
        public double TotalValue { get; set; }
        public bool? IsActive { get; set; }
        public string InsertUser { get; set; }
        public DateTime? InsertDate { get; set; }
        public string UnitName { get; set; }

    }
}
