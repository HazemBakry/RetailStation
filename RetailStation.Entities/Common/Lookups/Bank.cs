using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Common.Lookups
{
    [Table("Banks", Schema = "HR")]

    public class Bank
    {
        public int BankId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
    }
}
