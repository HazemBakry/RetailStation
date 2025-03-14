using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.Global
{
    [Table("Branches", Schema = "Global")]

    public class Branch
    {
        [Key]
        public int BranchId { get; set; }
        public string Code { get; set; }
        public int DisplayOrder { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public bool IsActive { get; set; }
        public bool IsAdminBranch { get; set; }
        public int CityId { get; set; }
        public int DrawingsCostCenterId { get; set; }
        public int ExpensesCostCenterId { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Fax { get; set; }
        public string Address { get; set; }
        public string Notes { get; set; }
        public string InsertUser { get; set; }
        public DateTime InsertDate { get; set; }
        public string UpdateUser { get; set; }
        public DateTime UpdateDate { get; set; }
    }
}
