using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.SystemAdmin
{
    [Table("Cities", Schema = "Operation")]
    public class City:CreatorModel
    {
        [Key]
        public int CityId { get; set; }

        [Required]
        public int CountryId { get; set; }

        [MaxLength(20)]
        public string PostalCode { get; set; }

        [Required, MaxLength(100)]
        public string NameAR { get; set; }

        [Required, MaxLength(100)]
        public string NameEN { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
