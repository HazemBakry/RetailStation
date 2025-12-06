using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.SystemAdmin
{
    [Table("Countries", Schema = "Operation")]
    public class Country:CreatorModel
    {
        [Key]
        public int CountryId { get; set; }

        [Required, MaxLength(100)]
        public string NameAR { get; set; }

        [Required, MaxLength(100)]
        public string NameEN { get; set; }
        [MaxLength(10)]
        public string CountryCode { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
