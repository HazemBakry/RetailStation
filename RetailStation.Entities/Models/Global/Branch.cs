using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.Global
{
    [Table("Branches", Schema = "Global")]

    public class Branch : CreatorModel
    {
        [Key]
        public int BranchId { get; set; }
        public string Code { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public int? DisplayOrder { get; set; }
        public string Phone { get; set; }
        public string TaxNumber { get; set; }
        public double? TaxPercent { get; set; }
        public int? CityId { get; set; }
        public bool IsActive { get; set; }
        public int? DrawingsCostCenterId { get; set; }
        public int? ExpensesCostCenterId { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string Image { get; set; }
        public int? DinningTables { get; set; }
        public int? FamilyTables { get; set; }
        public bool? ShowInReports { get; set; }
        public bool IsAdmin { get; set; }
        public string SubscriberId { get; set; }
        public string AttendanceDbPath { get; set; }
    }
}
