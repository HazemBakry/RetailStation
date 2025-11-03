using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Website
{
    public class CartModel
    {
        public int? CartId { get; set; }
        public int MerchantItemId { get; set; }
        public float Quantity { get; set; }
        public string UserId { get; set; }
    }
}
