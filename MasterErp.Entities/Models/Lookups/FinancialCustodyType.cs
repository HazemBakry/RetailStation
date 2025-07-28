using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Lookups
{
    [Table("FinancialCustodyTypes", Schema = "HR")]
    public class FinancialCustodyType : CreatorModel
    {
        [Key]
        public int FinancialCustodyTypeId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public bool IsActive { get; set; }
    }
}
