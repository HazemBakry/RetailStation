using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RetailStation.Entities.Models;

namespace RetailStation.Entities.Common.Finance
{
    public class AccountOpeningBalance : CreatorModel
    {
        [Key]
        public int Id { get; set; }
        public int AccountId { get; set; }
        public double Debit { get; set; }
        public double Credit { get; set; }
    }
}
