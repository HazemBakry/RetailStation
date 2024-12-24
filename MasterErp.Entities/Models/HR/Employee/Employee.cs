using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models.HR.Employee
{
    public class Employee : CreatorModel
    {
        public int EmployeeId { get; set; }//
        public int? ManagerId { get; set; }//1
        public int Code { get; set; }//1 NOT NULL
        public int JobId { get; set; }//1 NOT NULL
        public int? BranchId { get; set; }//1  NOT NULL
        public string FullNameAR { get; set; }// concatenate NOT NULL
        public string FirstNameAR { get; set; }//1
        public string FatherNameAR { get; set; }//1
        public string GrandNameAR { get; set; }//1
        public string LastNameAR { get; set; }//1
        public string FullNameEN { get; set; }//1 NOT NULL
        public string FirstNameEN { get; set; }//1
        public string FatherNameEN { get; set; }//1
        public string GrandNameEN { get; set; }//1
        public string LastNameEN { get; set; }//1
        public int? SocialStatusId { get; set; }//1
        public int? StatusId { get; set; }  // 1 by default 1
        public int? NationalityId { get; set; }//1 NOT NULL
        public DateTime? BirthDate { get; set; }//1 NOT NULL
        public string BirthPlace { get; set; }//1
        public int? SponsorId { get; set; }//1
        public int? ReligionId { get; set; }//1 NOT NULL
        public string Address { get; set; }//1
        public string Image { get; set; } //1
        public string FilesPath { get; set; }//1
        public string BorderEntryNumber { get; set; }//2
        public string PassportNumber { get; set; }//2
        public string ArrivalPort { get; set; }//2
        public string VisaNumber { get; set; }//2
        public int? VisaJobId { get; set; }//1
        public DateTime? VisaIssueDate { get; set; }//2
        public DateTime? PassportExpireDate { get; set; }//2
        public string Phone { get; set; }//1
        public string Email { get; set; }//1
        public EmployeeContract EmployeeContract { get; set; }
        public EmployeeVerification EmployeeVerification { get; set; }
        public EmployeeAttachment EmployeeExtraData { get; set; }

    }
}
