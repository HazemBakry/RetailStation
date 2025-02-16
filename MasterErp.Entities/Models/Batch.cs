using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class Batch : CreatorModel
    {
        public int BatchId { get; set; }
        public string NameAr { get; set; }
        public string BatchType { get; set; }
        public int CustomerId { get; set; }
        public double Amount { get; set; }
        public DateTime InsertDate { get; set; }
        public int LeadgerJournalId { get; set; }
        public string PaymentMethod { get; set; }
    }
}
