using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Operation
{
    [Table("Branches", Schema = "Operation")]

    public class Branch:CreatorModel
    {
        public int BranchId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; } 
        public string Phone { get; set; }
        public string Address { get; set; }
        public int? RegionId { get; set; }
        public bool IsActive { get; set; } = true;
        public string ImageURL { get; set; }

        public TimeSpan? OpeningTimeFrom { get; set; }
        public TimeSpan? OpeningTimeTo { get; set; }

        public string WorkingTimeAR { get; set; }
        public string WorkingTimeEN { get; set; }
        public int MerchantId { get; set; }
    }
}
