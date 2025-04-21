using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common.Lookups
{
    [Table("JournalEntryTypes", Schema = "Finance")]
    public class JournalType:CreatorModel
    {
        [Key]
        public int JournalTypeId { get; set; }
        public int Code { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string Notes { get; set; }
        public bool? IsActive { get; set; }
    }
}
