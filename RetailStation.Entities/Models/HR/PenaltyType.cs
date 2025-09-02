using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.HR
{
    [Table("PenaltyTypes", Schema = "HR")]

    public class PenaltyType
    {
        [Key]
        public int PenaltyTypeId { get; set; }
        public string NameEN { get; set; }
        public string NameAR { get; set; }
    }
}
