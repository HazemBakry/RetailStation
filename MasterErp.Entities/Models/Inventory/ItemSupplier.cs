using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

#nullable disable

namespace MasterErp.Entities.Models.Inventory
{
    public class ItemSupplier
    {
        public int Id { get; set; }
        public int SupplierId { get; set; }
        public int ItemId { get; set; }
        public Item Item { get; set; }
        [NotMapped]
        public string SupplierName { get; set; }
        [NotMapped]
        public string ItemName { get; set; }
    }
}
