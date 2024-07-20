using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class VacationType
    {
        public int VacationTypeId { get; set; }
        public string NameEN { get; set; }
        public string NameAR { get; set; }
        public bool IsActive { get; set; }
        public string Code { get; set; }
        public string Notes { get; set; }
        public string InsertUser { get; set; }
        public DateTime? InsertDate { get; set; }
        public string UpdateUser { get; set; }
        public DateTime? UpdateDate { get; set; }
    }
}
