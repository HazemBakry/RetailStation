using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

#nullable disable

namespace MasterErp.Entities.Models.Inventory
{
    [Table("Units", Schema = "Inventory")]

    public class Unit : CreatorModel
    {
        public int UnitId { get; set; }
        public string Code { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public bool? IsActive { get; set; }
        public string Notes { get; set; }
    }
}
