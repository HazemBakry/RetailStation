using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class PaymentReceipt
    {
        [Key]
        public int PaymentReceiptId { get; set; }
        public int ReceiptNumber { get; set; }
        public int ReceiptLedgerId { get; set; }
        public int PaymentTypeId { get; set; }
        public int? PaidWithId { get; set; }
        public int? SafeId { get; set; }
        public int AgencyTypeId { get; set; }
        public int AgencyId { get; set; }
        public int AccountId { get; set; }
        public double MoneyAmount { get; set; }
        public bool IsLocked { get; set; }
        public bool IsCancelled { get; set; }
        public string BenefitPerson { get; set; }
        public string ChequeNumber { get; set; }
        public string DocNumber { get; set; }
        public string Notes { get; set; }
        public string InsertUser { get; set; }
        public string UpdateUser { get; set; }
        public DateTime ReleaseDate { get; set; }
        public DateTime InsertDate { get; set; }
        public DateTime? UpdateDate { get; set; }

    }
}
