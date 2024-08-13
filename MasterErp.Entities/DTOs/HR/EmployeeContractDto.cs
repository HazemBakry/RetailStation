using MasterErp.Entities.Models.HR.Employee;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.HR
{
    public class EmployeeContractDto : CreatorModel
    {
        public int? EmployeeContractId { get; set; }
        public DateTime JoinDate { get; set; }//3
        public DateTime LastJoinDate { get; set; }//3
        public int ContractPeriodYears { get; set; }//3

        public int? VacationPeriodDays { get; set; }//3

        public DateTime? VacationDate { get; set; }//3
        public bool IsGossi { get; set; }//3


        //salary
        public int BasicSalary { get; set; }
        public int ExtraSalary { get; set; }
        public int Transportation { get; set; }
        public int HousingAllowance { get; set; }
        public int MobileAllowance { get; set; }
        public int WorkNature { get; set; }
        public int MealAllowance { get; set; }
        public int? Other { get; set; }
        public int? TotalSalary { get; set; }


        public int? EmployeeId { get; set; }
        public Employee Employee { get; set; }

        public int CalcTotalSalary()
        {
            return BasicSalary + ExtraSalary + Transportation + HousingAllowance + MobileAllowance + WorkNature + MealAllowance + Other??0;

        }
    }
}
