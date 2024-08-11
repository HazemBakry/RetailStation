using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.HR.Employee
{
    public class EmployeeContract : CreatorModel
    {
        public int EmployeeContractId { get; set; }
        public DateTime JoinDate { get; set; }//3
        public DateTime LastJoinDate { get; set; }//3
        public int ContractPeriodYears { get; set; }//3

        public int? VacationPeriod { get; set; }//3

        public DateTime? VacationDate { get; set; }//3
        public bool IsGossi { get; set; }//3


        //salary
        public int BasicSalary { get; set; }
        public int ExtraSalary { get; set; } = 0;
        public int Transportation { get; set; } = 0;
        public int HousingAllowance { get; set; } = 0;
        public int MobileAllowance { get; set; } = 0;
        public int WorkNature { get; set; } = 0;
        public int MealAllowance { get; set; } = 0;
        public int Other { get; set; } = 0;
        public int TotalSalary { get; set; }


        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }

        //public int NoYears { get; set; }
        //public DateTime StartDate { get; set; }
        //public DateTime EndDate { get; set; }
        //public int VacationEvery { get; set; }
        //public int VacationDays { get; set; }

        // Contract Ending
    }
}
