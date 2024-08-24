using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.Inventory
{

    public class ItemCategoryModel : CreatorModel
    {
        public int? ItemCategoryId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public int OperationAccountId { get; set; }
        public string OperationAccountName { get; set; }
        public int ManagementAccountId { get; set; }
        public string ManagementAccountName { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public int? DisplayOrder { get; set; }
        public int? TotalCount { get; set; }
    }
}
