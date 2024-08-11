using MasterErp.Entities.Models.HR.Employee;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.HR
{

    public class EmployeeExtraDataDto : CreatorModel
    {
        public int? EmployeeExtraDataId { get; set; }
        public string DrivingLicenseNumber { get; set; } //4
        public string DrivingLicenseIssueHijri { get; set; }//4
        public DateTime? DrivingLicenseIssue { get; set; }//4
        public string DrivingLicenseExpireHijri { get; set; }//4
        public DateTime? DrivingLicenseExpire { get; set; }//4
        public int? VehicleId { get; set; }//4

        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }
    }
}
