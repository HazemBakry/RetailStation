using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class JournalEntryType
    {
        [Key]
        public int JournalTypeID { get; set; }
        public string Code { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string Notes { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreateDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifyDate { get; set; }
    }
}
