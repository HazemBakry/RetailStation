using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MasterErp.Entities.Models.HR;

namespace MasterErp.Entities.DTOs.HR
{
    public class EmployeeContractDto : CreatorModel
    {
        public int? ContractId { get; set; }
        public int? EmployeeId { get; set; }
        public int? BranchId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int ContractPeriodYears { get; set; }
        public int? VacationPeriodDays { get; set; }
        public int? VacationEvery { get; set; }
        public int? VacationDays { get; set; }
        public bool IsGossi { get; set; }


        //salary
        public double BasicSalary { get; set; }
        public double? ExtraSalary { get; set; }
        public double? Transportation { get; set; }
        public double? HousingAllowance { get; set; }
        public double? MobileAllowance { get; set; }
        public double? WorkNature { get; set; }
        public double? MealAllowance { get; set; }
        public double? Other { get; set; }
        public double? TotalSalary { get; set; }
        public Employee Employee { get; set; }


        public double CalcTotalSalary()
        {
            return BasicSalary + ExtraSalary + Transportation + HousingAllowance + MobileAllowance + WorkNature + MealAllowance + Other ?? 0;
        }
    }
}
