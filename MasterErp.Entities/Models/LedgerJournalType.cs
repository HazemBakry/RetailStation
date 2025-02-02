using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    [Table("LedgerJournalTypes", Schema = "Finance")]
    public class LedgerJournalType:CreatorModel
    {
        [Key]
        public int Id { get; set; }
        public string NameAr { get; set; }
    }
}
