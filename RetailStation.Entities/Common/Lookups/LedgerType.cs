using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Common.Lookups
{
    [Table("LedgerTypes", Schema = "Finance")]
    public class LedgerType
    {
        [Key]
        public int LedgerTypeId { get; set; }        
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string GroupName { get; set; }
    }
}
