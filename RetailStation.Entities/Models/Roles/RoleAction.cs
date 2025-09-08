using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models
{
    //[Table("RoleActions", Schema = "Lookup")]
    public class RoleAction
    {
        public int RoleActionId { get; set; }
        public string ActionName { get; set; }
        public int? DisplayOrder { get; set; }
    }
}
