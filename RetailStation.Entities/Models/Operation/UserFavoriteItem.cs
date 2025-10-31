using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Operation
{
    [Table("UserFavoriteItems", Schema = "Website")]

    public class UserFavoriteItem
    {
        public int UserFavoriteItemId { get; set; }
        public int SupplierItemId { get; set; }
        public string UserId { get; set; }
    }
}
