using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.HR
{
    [Table("EmployeeContracts", Schema = "HR")]

    public class EmployeeContract : CreatorModel
    {
        public int EmployeeContractId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int ContractPeriodYears { get; set; }
        public int? VacationPeriodDays { get; set; }
        public int? VacationEvery { get; set; }
        public int? VacationDays { get; set; }
        public bool IsGossi { get; set; }
        public Employee Employee { get; set; }
    }
}
