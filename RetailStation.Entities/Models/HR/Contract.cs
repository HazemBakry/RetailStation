using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.HR
{
    [Table("Contracts", Schema = "HR")]

    public class Contract : CreatorModel
    {
        public int ContractId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int ContractPeriodYears { get; set; }
        public int? VacationPeriodDays { get; set; }
        public int? VacationEvery { get; set; }
        public int? VacationDays { get; set; }
        public bool? IsGossi { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? VacationDate { get; set; }
        public DateTime? JoinDate { get; set; }
        public DateTime? LastJoinDate { get; set; }
        public Employee Employee { get; set; }
    }
}
