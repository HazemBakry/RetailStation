using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Finance
{
    [Table("Banks", Schema = "Finance")]

    public class Bank: CreatorModel
    {
        public int? BankId { get; set; }
        public string? NameAR { get; set; }
        public string? NameEN { get; set; }
        [NotMapped]
        public int? TotalCount { get; set; }
    }
}
