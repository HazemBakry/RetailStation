using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common.Lookups
{
    [Table("IqamaIssuePlaces", Schema = "HR")]

    public class IqamaIssuePlace
    {
        public int IqamaIssuePlaceId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
    }
}
