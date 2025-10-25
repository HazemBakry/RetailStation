using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Global
{
    [Table("Regions", Schema = "Global")]

    public class Region
    {
        public int RegionId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public int CountryId { get; set; }
        public int CityId { get; set; }
    }
}
