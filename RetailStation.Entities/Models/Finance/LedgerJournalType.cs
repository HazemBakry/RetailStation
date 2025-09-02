using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Finance
{
    [Table("LedgerJournalTypes", Schema = "Finance")]

    public class LedgerJournalType : CreatorModel
    {
        public int LedgerJournalTypeId { get; set; }
        public string NameAR { get; set; }
    }
}
