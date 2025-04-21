using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common.Finance.GeneralAccounts
{

    public class PaymentTermModel : CreatorModel
    {
        public int? PaymentTermId { get; set; }
        public string NameEN { get; set; }
        public string NameAR { get; set; }
        public bool IsActive { get; set; }
        public List<PaymentTermDetailsModel> PaymentTermDetails { get; set; }
        public int? TotalCount { get; set; }

    }
    public class PaymentTermDetailsModel : CreatorModel
    {
        public int? PaymentTermDetailsId { get; set; }
        public int PaymentTermId { get; set; }
        public int DuePercentage { get; set; } 
        public int DueAfterDays { get; set; }
    }
}
