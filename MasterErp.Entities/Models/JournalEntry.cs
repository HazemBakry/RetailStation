using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class JournalEntry
    {
        public int JournalEntryID { get; set; }
        public string EntryNumber { get; set; }
        public string DocNumber { get; set; }
        public DateTime EntryDate { get; set; }
        public string Description { get; set; }
        public string Notes { get; set; }
        public bool? IsLocked { get; set; }
        public bool? IsCancelled { get; set; }
        public int JournalTypeID { get; set; }
        public int PeriodID { get; set; }
        public int? ActionTypeID { get; set; }
        public int? ActionID { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreateDate { get; set; }
        public string PostedBy { get; set; }
        public DateTime? PostDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifyDate { get; set; }
    }
}
