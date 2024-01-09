using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class AccountType
    {
        public int AccountTypeId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public bool? IsActive { get; set; }
    }
}
