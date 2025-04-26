using MasterErp.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.Inventory
{
    public class MaterialRequestModel : GeneralOrderModel
    {
        public int? MaterialRequestId { get; set; }
        public int? PurchaseOrderId { get; set; }
        public int BranchId { get; set; }
        public string BranchNameAR { get; set; }
        public string BranchNameEN { get; set; }
        public int? PurposeId { get; set; }
        public string PurposeNameAR { get; set; }
        public string PurposeNameEN { get; set; }
        public List<GeneralOrderDetailsModel> OrderDetails { get; set; }
        public int? NextId { get; set; }
        public int? PreviousId { get; set; }

        public int? TotalCount { get; set; }

    }
    public class MaterialRequestDetailsModel : GeneralOrderDetailsModel
    {
        public int? MaterialRequestId { get; set; }


    }

}
