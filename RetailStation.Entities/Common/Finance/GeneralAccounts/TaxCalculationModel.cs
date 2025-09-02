using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Common.Finance.GeneralAccounts
{
    
    public class TaxCalculationModel : CreatorModel
    {
        public int? TaxCalculationId { get; set; }
        public string NameEN { get; set; }
        public string NameAR { get; set; }
        public string Description { get; set; }
        public int TaxLookupId { get; set; }
        public string TaxType { get; set; }
        public string TaxScope { get; set; }
        public string TaxLookupNameEN { get; set; }
        public string TaxLookupNameAR { get; set; }
        public int Amount { get; set; }
        public bool IsActive { get; set; }

        public int? TotalCount { get; set; }

    }
}
