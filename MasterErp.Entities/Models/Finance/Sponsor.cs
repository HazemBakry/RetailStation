using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Finance
{
    [Table("Sponsors", Schema = "Finance")]

    public class Sponsor
    {
        public int SponsorID { get; set; }
        public string Code { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string SponsorSSN { get; set; }
        public int ParentID { get; set; }
        public string Phone1 { get; set; }
        public string Phone2 { get; set; }
        public int SponsorTypeID { get; set; }
        public string Address { get; set; }
        public bool IsActive { get; set; }
        public string FileName { get; set; }
        public string Notes { get; set; }
        public int InsertUser { get; set; }
        public int UpdateUser { get; set; }
        public DateTime UpdateDate { get; set; }
        public int Saudi_Count { get; set; }
        public double Saudi_Amount { get; set; }
    }
}
