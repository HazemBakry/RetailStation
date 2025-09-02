using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Finance
{
    [Table("TaxCalculations", Schema = "Finance")]
    public class TaxCalculation : CreatorModel
    {
        public int TaxCalculationId { get; set; }
        public string NameEN { get; set; }
        public string NameAR { get; set; }
        public string Description { get; set; }
        public int TaxLookupId { get; set; }
        public string TaxType { get; set; }
        public string TaxScope { get; set; }
        public int Amount { get; set; }
        public bool IsActive { get; set; }
    }
}
