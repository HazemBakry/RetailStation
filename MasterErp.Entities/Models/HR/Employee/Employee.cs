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
        public int Code { get; set; }//1
        public int? ManagerId { get; set; }//1
        public string IqamaNumber { get; set; }//1
        public int JobId { get; set; }//1
        public int? IqamaJobId { get; set; }//1
        public int BranchId { get; set; }//1
        public int StatusId { get; set; }  // 1 by default

        public string FullNameAR { get; set; }// concatenate
        public string FirstNameAR { get; set; }//1
        public string FatherNameAR { get; set; }//1
        public string GrandNameAR { get; set; }//1
        public string LastNameAR { get; set; }//1
        public string FullNameEN { get; set; }//1
        public string FirstNameEN { get; set; }//1
        public string FatherNameEN { get; set; }//1
        public string GrandNameEN { get; set; }//1
        public string LastNameEN { get; set; }//1

        public int BankId { get; set; }//1
        public string BankAccountNumber { get; set; }//1
        public DateTime BirthDate { get; set; }//1
        public string BirthPlace { get; set; }//1

        public int NationalityId { get; set; }//1
        public int? SponsorId { get; set; }//1
        public int? IqamaIssuePlaceId { get; set; }//1
        public DateTime? IqamaIssueDate { get; set; }//1
        public DateTime? IqamaExpireDate { get; set; }//1
        public string IqamaExpireDateHijri { get; set; }//1
        public string IqamaIssueDateHijri { get; set; }//1
        public string IqamaJobDescription { get; set; }//1
        public string Religion { get; set; }//1
        public string Address { get; set; }//1
        public string Image { get; set; } //1
        public string FilesPath { get; set; }//1
        public EmployeeContract EmployeeContract { get; set; }
        public EmployeeVerification EmployeeVerification { get; set; }
        public EmployeeExtraData EmployeeExtraData { get; set; }

    }
}
