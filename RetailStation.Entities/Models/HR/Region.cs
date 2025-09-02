using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.HR
{
    [Table("Regions", Schema = "HR")]
    public class Region : CreatorModel
    {
        public int? RegionId { get; set; }
        public string? Code { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public int? BranchId { get; set; }
        public int? CityId { get; set; }
        public int? CountryId { get; set; }
        public double? DeliveryValue { get; set; }
        public bool IsActive { get; set; }
        [NotMapped]
        public int? TotalCount { get; set; }
    }
}
