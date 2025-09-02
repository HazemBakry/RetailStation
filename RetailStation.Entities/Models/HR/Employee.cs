using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.HR
{
    [Table("Employees", Schema = "HR")]

    public class Employee : CreatorModel
    {
        public int EmployeeId { get; set; }//
        public int? ManagerId { get; set; }
        public int? DepartmentId { get; set; }

        public int Code { get; set; } 
        public int JobId { get; set; } 
        public int? BranchId { get; set; }  
        public string FullNameAR { get; set; }
        public string FirstNameAR { get; set; }
        public string FatherNameAR { get; set; }
        public string GrandNameAR { get; set; }
        public string LastNameAR { get; set; }
        public string FullNameEN { get; set; } 
        public string FirstNameEN { get; set; }
        public string FatherNameEN { get; set; }
        public string GrandNameEN { get; set; }
        public string LastNameEN { get; set; }
        public int? SocialStatusId { get; set; }
        public int? StatusId { get; set; } 
        public int? NationalityId { get; set; } 
        public DateTime? BirthDate { get; set; } 
        public string BirthPlace { get; set; }
        public int? SponsorId { get; set; }
        public int? ReligionId { get; set; }
        public string Address { get; set; }
        public string Image { get; set; } 
        public string FilesPath { get; set; }
        public string BorderEntryNumber { get; set; }
        public string PassportNumber { get; set; }
        public string ArrivalPort { get; set; }
        public string VisaNumber { get; set; }
        public int? VisaJobId { get; set; }
        public DateTime? VisaIssueDate { get; set; }
        public DateTime? PassportExpireDate { get; set; }
        //public DateTime? JoinDate { get; set; }
        //public DateTime? LastJoinDate { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public Contract EmployeeContract { get; set; }
        public EmployeeVerification EmployeeVerification { get; set; }
        public EmployeeAttachment EmployeeExtraData { get; set; }

    }
}
