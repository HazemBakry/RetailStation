using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Purchases
{
    public class Cart
    {
        public int CartId { get; set; }
        public int SupplierItemId { get; set; }
        public float Quantity { get; set; }
        public string UserId { get; set; }
    }
}
