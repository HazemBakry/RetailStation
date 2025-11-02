using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.SystemSettings
{
    public class CountryModel : CreatorModel
    {
        public int? CountryId { get; set; }

        public string NameAR { get; set; }


        public string NameEN { get; set; }

        public bool IsActive { get; set; } = true;
        public int? TotalCount { get; set; }
    }
    public class CityModel : CreatorModel
    {

        public int? CityId { get; set; }


        public int CountryId { get; set; }


        public string PostalCode { get; set; }


        public string NameAR { get; set; }


        public string NameEN { get; set; }

        public bool IsActive { get; set; } = true;
        public int? TotalCount { get; set; }
    }
    public class RegionModel : CreatorModel
    {

        public int? RegionId { get; set; }


        public string Code { get; set; }


        public string NameAR { get; set; }


        public string NameEN { get; set; }

        public int? CityId { get; set; }
        public int? CountryId { get; set; }
        public bool IsActive { get; set; } = true;

        public int? TotalCount { get; set; }

    }
}
