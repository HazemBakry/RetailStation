using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class ItemCategory
    {
        public int ItemCategoryId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public int? DisplayOrder { get; set; }
    }
}
