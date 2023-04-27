using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class IqamaJob
    {
        public int IqamaJobID { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string Code { get; set; }
        public string Notes { get; set; }
        public int InsertUser { get; set; }
        public DateTime InsertDate { get; set; }
        public int UpdateUser { get; set; }
        public DateTime UpdateDate { get; set; }
    }
}
