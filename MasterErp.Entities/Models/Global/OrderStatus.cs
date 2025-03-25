using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Global
{


    [Table("OrderStatus", Schema = "Global")]

    public class OrderStatus : CreatorModel
    {
        [Key]
        public int StatusId { get; set; }
        public int DisplayOrder { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
       
    }
}
