using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Operation
{
    public class BestSellerItemModel
    {
        public int? BestSellerItemId { get; set; }
        public int MerchantItemId { get; set; }
        public string MerchantName { get; set; }
        public string MerchantItemName { get; set; }
        public bool IsActive { get; set; } = true;
        public int DisplayOrder { get; set; }
    }
}
