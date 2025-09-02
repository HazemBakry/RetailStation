using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.HR
{

    public class SponsorModel : CreatorModel
    {

        public int? SponsorId { get; set; }
        public string Code { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string SponsorSSN { get; set; }
        public int? ParentId { get; set; }
        public string ParentNameAR { get; set; }
        public string ParentNameEN { get; set; }
        public string Phone1 { get; set; }
        public string Phone2 { get; set; }
        public int SponsorTypeId { get; set; }
        public string SponsorTypeNameAR { get; set; }
        public string SponsorTypeNameEN { get; set; }
        public string Address { get; set; }
        public bool IsActive { get; set; }
        public string FileName { get; set; }
        public string Notes { get; set; }



        public int? Saudi_Count { get; set; }
        public double? Saudi_Amount { get; set; }
        public int? TotalCount { get; set; }


    }
}
