using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MasterErp.Entities.Models.HR;

namespace MasterErp.Entities.DTOs.HR
{
    public class EmployeeVerificationDto : CreatorModel
    {
        [Key]
        public int? EmployeeVerificationId { get; set; }
        public int? EmployeeId { get; set; }
        public int? BankId { get; set; }//1
        public string BankAccountNumber { get; set; }//1

        public string IqamaNumber { get; set; }//1
        public int? IqamaIssuePlaceId { get; set; }//1
        public DateTime? IqamaIssueDate { get; set; }//1
        public DateTime? IqamaExpireDate { get; set; }//1

        public string DrivingLicenseNumber { get; set; } //4
        public DateTime? DrivingLicenseIssueDate { get; set; }//4
        public DateTime? DrivingLicenseExpireDate { get; set; }//4
        public int? VehicleId { get; set; }//4
        public string VehicleNumber { get; set; }//4
        public int? VehicleCode { get; set; }//4
        public bool? IsVisa { get; set; }
        public Employee Employee { get; set; }
    }
}
