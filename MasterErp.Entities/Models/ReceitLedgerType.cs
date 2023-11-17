using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class ReceitLedgerType
    {
        [Key]
        public int ReceiptLedgerTypeId { get; set; }

        public string NameAR { get; set; }
        public string NameEN { get; set; }
    }
}
