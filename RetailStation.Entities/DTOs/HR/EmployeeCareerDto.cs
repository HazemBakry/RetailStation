using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.HR
{
    public class EmployeeCareerDto : CreatorModel
    {
        public int? EmployeeCareerId { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public int JobId { get; set; }
        public string JobName { get; set; }
        public int BranchId { get; set; }
        public string BranchName { get; set; }
        public int? WorkFlowStatusId { get; set; }
        public string WorkFlowStatusNameAR { get; set; }
        public string WorkFlowStatusNameEN { get; set; }
        public string Notes { get; set; }
        public DateTime ExecutionDate { get; set; }

        public int? TotalCount { get; set; }
        public bool? ModifySalary { get; set; }


        //salary
        public double? BasicSalary { get; set; }
        public double? ExtraSalary { get; set; }
        public double? Transportation { get; set; }
        public double? HousingAllowance { get; set; }
        public double? MobileAllowance { get; set; }
        public double? WorkNature { get; set; }
        public double? MealAllowance { get; set; }
        public double? Other { get; set; }
        public double? TotalSalary => CalcTotalSalary();


        public double CalcTotalSalary()
        {
            return BasicSalary + ExtraSalary + Transportation + HousingAllowance + MobileAllowance + WorkNature + MealAllowance + Other ?? 0;
        }
    }



}
