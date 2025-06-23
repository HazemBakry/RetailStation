using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.DTOs.HR
{
    public class EmployeeExpireReportModel
    {

        public int EmployeeId { get; set; }
        public int? EmployeeCode { get; set; }

        public string IqamaNumber { get; set; }

        public string EmployeeNameAR { get; set; }
        public string EmployeeNameEN { get; set; }

        public int? StatusId { get; set; }
        public string EmployeeStatusNameEN { get; set; }
        public string EmployeeStatusNameAR { get; set; }

        public string Email { get; set; }

        public string NationalityNameAR { get; set; }
        public string NationalityNameEN { get; set; }

        public string SponsorNameAR { get; set; }
        public string SponsorNameEN { get; set; }

        public DateTime? BirthDate { get; set; }

        public string JobNameAR { get; set; }
        public string JobNameEN { get; set; }

        public string BranchNameAR { get; set; }
        public string BranchNameEN { get; set; }

        public DateTime? JoinDate { get; set; }
        public int? ContractPeriod { get; set; }

        public int? SocialStatusId { get; set; }
        public string SocialStatusNameAR { get; set; }
        public string SocialStatusNameEN { get; set; }

        public string Address { get; set; }
        public string Phone { get; set; }
        public string Notes { get; set; }

        public DateTime? ExpiryDate { get; set; }
        public int? TotalCount { get; set; }
    }

    public class EmployeeExpireReportExportModel
    {
        [JsonProperty("Employee Code")]
        public int? EmployeeCode { get; set; }

        [JsonProperty("Iqama Number")]
        public string IqamaNumber { get; set; }

        [JsonProperty("Employee Name")]
        public string EmployeeName { get; set; }

        [JsonProperty("Email")]
        public string Email { get; set; }

        [JsonProperty("Nationality")]
        public string NationalityName { get; set; }


        [JsonProperty("Sponsor")]
        public string SponsorName { get; set; }

        [JsonProperty("Birth Date")]
        public string BirthDate { get; set; }

        [JsonProperty("Job Title")]
        public string JobName { get; set; }

        [JsonProperty("Branch")]
        public string BranchName { get; set; }

        [JsonProperty("Contract Period (Years)")]
        public int? ContractPeriod { get; set; }

        [JsonProperty("Social Status")]
        public string SocialStatus { get; set; }

        [JsonProperty("Address")]
        public string Address { get; set; }

        [JsonProperty("Phone")]
        public string Phone { get; set; }
        [JsonProperty("Work Status")]
        public string WorkStatus { get; set; }

        [JsonProperty("Join Date")]
        public string JoinDate { get; set; }

        [JsonProperty("Expiry Date")]
        public string ExpiryDate { get; set; }

        [JsonProperty("Notes")]
        public string Notes { get; set; }
    }

}
