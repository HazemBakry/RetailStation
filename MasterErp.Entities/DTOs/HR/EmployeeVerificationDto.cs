using MasterErp.Entities.Models.HR.Employee;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.HR
{
    public class EmployeeVerificationDto : CreatorModel
    {
        [Key]
        public int? EmployeeVerificationId { get; set; }
        public int? EmployeeId { get; set; }
        public string BorderEntryNumber { get; set; }//2
        public string PassportNumber { get; set; }//2
        public DateTime? BorderEntryDate { get; set; }// 2
        public string ArrivalPort { get; set; }//2
        public string VisaNumber { get; set; }//2
        public DateTime? VisaIssueDate { get; set; }//2
        public DateTime? PassportExpireDate { get; set; }//2
        public DateTime? PassportIssuanceDate { get; set; }//2
        public string PassportIssuancePlace { get; set; } //2
        public Employee Employee { get; set; }
    }
}
