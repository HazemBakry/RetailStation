using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    [Table("AccountOpeningBalance", Schema = "Finance")]

    public class AccountOpeningBalance
    {
        [Key]
        public int Id { get; set; }
        public int AccountId { get; set; }
        
        public double Debit { get; set; }
        public double Credit { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreateDate { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifyDate { get; set; }
    }
}
