using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.HR
{
    [Table("DeductTypes", Schema = "HR")]

    public class DeductType : CreatorModel
    {
        public int DeductTypeId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public bool IsActive { get; set; }
        public string Code { get; set; }
        public string Notes { get; set; }

    }
}
