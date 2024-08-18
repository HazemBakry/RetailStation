using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Lookups
{
    public class Region
    {
        public int RegionId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string PostalCode { get; set; }
        public bool IsActive { get; set; }
    }
}
