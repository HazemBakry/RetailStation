using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Models
{
    public class Employee
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
        public int NationalityId { get; set; }
        public DateTime BirthDate { get; set; }
        public string BirthPlace { get; set; }
        public int SponsorId { get; set; }
        public int? IqamaIssuePlaceId { get; set; }
        public DateTime? IqamaExpireDate { get; set; }
        public string IqamaExpireDateHijri { get; set; }
        public DateTime? IqamaIssueDate { get; set; }
        public string IqamaIssueDateHijri { get; set; }
        public int? IqamaJobDescription { get; set; }
        public string VisaNumber { get; set; }
        public DateTime? VisaIssueDate { get; set; }
        public string PassportNumber { get; set; }
        public DateTime? PassportExpireDate { get; set; }
        public DateTime? PassportIssuanceDate { get; set; }
        public string PassportIssunacePlace { get; set; }
        public string DrivingLicenseNumber { get; set; }
        public string DrivingLicenseIssueHijri { get; set; }
        public DateTime? DrivingLicenseIssue { get; set; }
        public string DrivingLicenseExpireHijri { get; set; }
        public DateTime? DrivingLicenseExpire { get; set; }
        public int? VehicleId { get; set; }
        public DateTime JoinDate { get; set; }
        public DateTime LastJoinDate { get; set; }
        public int ContractPeriod { get; set; }
        public DateTime? ContractEnding { get; set; }
        public string Religion { get; set; }
        public string BorderEntryNumber { get; set; }
        public string BorderEntryDate { get; set; }
        public string ArrivalPort { get; set; }
        public string Address { get; set; }
        public int? VacationPeriods { get; set; }
        public int? VacationDates { get; set; }
        public bool IsFinger { get; set; }
        public bool IsDriver { get; set; }
        public bool IsGossi { get; set; }
        public bool IsActive_Insurance { get; set; }
        public string Image { get; set; }
        public string FilesPath { get; set; }
        public int? InsertUser { get; set; }
        public int? UpdateUser { get; set; }
        public DateTime? InsertDate { get; set; }
        public DateTime? UpdateDate { get; set; }
    }
}
