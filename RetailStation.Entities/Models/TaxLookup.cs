using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models
{
    [Table("TaxLookups", Schema = "Finance")]
    public class TaxLookup
    {
        public int TaxLookupId { get; set; }
        public string NameEN { get; set; }
        public string NameAR { get; set; }
    }
}
