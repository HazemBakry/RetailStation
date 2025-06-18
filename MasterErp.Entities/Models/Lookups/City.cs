using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Lookups
{
    [Table("Cities", Schema = "Global")]

    public class City : CreatorModel
    {
        public int CityId { get; set; }
        public int? CountryId { get; set; }
        public string PostalCode { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public bool IsActive { get; set; }
    }
}
