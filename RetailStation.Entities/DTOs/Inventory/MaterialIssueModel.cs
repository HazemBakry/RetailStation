using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.Inventory
{
    public class MaterialIssueModel : GeneralOrderModel
    {
        public int? MaterialIssueId { get; set; }

        public int StoreId { get; set; }
        public string StoreNameAR { get; set; }
        public string StoreNameEN { get; set; }

        public int BranchId { get; set; }
        public string BranchNameAR { get; set; }
        public string BranchNameEN { get; set; }

        public List<GeneralOrderDetailsModel> OrderDetails { get; set; }

        public int? NextId { get; set; }
        public int? PreviousId { get; set; }
        public int? TotalCount { get; set; }

        public bool IsChecked { get; set; }
    }

}
