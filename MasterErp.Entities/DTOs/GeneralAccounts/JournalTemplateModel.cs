using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.GeneralAccounts
{


    public class JournalTemplateModel
    {

        public int? JournalTemplateId { get; set; }
        public string DocNumber { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string Description { get; set; }
        public int JournalTypeId { get; set; }
        public int? PeriodId { get; set; }
        public int? CurrencyId { get; set; }
        public int? TotalCount { get; set; }
        public List<JournalTemplateDetailsModel> Accounts { get; set; }
    }

    public class JournalTemplateDetailsModel
    {
        public int? TemplateDetailId { get; set; }
        public int? JournalTemplateId { get; set; }
        public int AccountId { get; set; }
        public string AccountNameAR { get; set; }
        public string AccountNameEN { get; set; }
        public double? Debit { get; set; }
        public double? Credit { get; set; }
        public int? CostCenterId { get; set; }
        public string CostCenterNameAR { get; set; }
        public string CostCenterNameEN { get; set; }
        public string Description { get; set; }

    }
}
