using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.HR
{
    public class EmployeeBasicInfo
    {
        public int EmployeeId { get; set; }
        public int Code { get; set; }
        public string IqamaNumber { get; set; }
        public int JobId { get; set; }
        public int BranchId { get; set; }
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
        public int StatusId { get; set; }  
        public int BankId { get; set; }
        public string BankAccount { get; set; }//
        public int NationalityId { get; set; }//
        public DateTime BirthDate { get; set; }//
        public string BirthPlace { get; set; }//
        public string Religion { get; set; }//
        public string Image { get; set; }
        public string FilesPath { get; set; }
        public int TotalCount { get; set; }
    }
}
