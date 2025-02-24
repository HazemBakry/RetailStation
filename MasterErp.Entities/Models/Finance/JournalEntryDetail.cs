using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Finance
{
    [Table("JournalEntryDetails", Schema = "Finance")]

    public class JournalEntryDetail
    {
        public int JournalEntryDetailId { get; set; }
        public int JournalEntryId { get; set; }
        public int AccountID { get; set; }
        public double? Debit { get; set; }
        public double? Credit { get; set; }
        public int? CostCenterId { get; set; }
        public double? CostValue { get; set; }
        public double? CostPercent { get; set; }
        public int? CurrencyId { get; set; }
        public string Description { get; set; }
        public int? SupplierId { get; set; }
    }
}
