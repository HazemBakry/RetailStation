using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class Units
    {
        [Key]
        public int UnitId { get; set; }
        public string UnitNameEn { get; set; }
        public string UnitNameAr { get; set; }
    }
}
