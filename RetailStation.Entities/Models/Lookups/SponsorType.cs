using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Lookups
{
    [Table("SponsorTypes", Schema = "HR")]

    public class SponsorType : CreatorModel
    {
        public int SponsorTypeId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string Code { get; set; }
        public bool IsActive { get; set; }

    }
}
