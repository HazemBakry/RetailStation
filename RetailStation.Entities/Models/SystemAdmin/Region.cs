using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.SystemAdmin
{
    [Table("Regions", Schema = "Operation")]
    public class Region : CreatorModel
    {
        [Key]
        public int RegionId { get; set; }

        [MaxLength(50)]
        public string Code { get; set; }

        [Required, MaxLength(100)]
        public string NameAR { get; set; }

        [Required, MaxLength(100)]
        public string NameEN { get; set; }

        public int? CityId { get; set; }
        public int? CountryId { get; set; }
        public bool IsActive { get; set; } = true;

    }
}
