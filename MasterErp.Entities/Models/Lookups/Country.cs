using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Lookups
{
    public class Country : CreatorModel
    {
        public int CountryId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string Code { get; set; }
        public bool IsActive { get; set; }

    }
}
