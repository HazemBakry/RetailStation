using Microsoft.AspNetCore.Http;
using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Operation
{

    public class ItemCategoryModel : CreatorModel
    {
        public int? ItemCategoryId { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public int? DisplayOrder { get; set; }
        public int? TotalCount { get; set; }

        public bool? IsGroup { get; set; }
        public int? ParentCategoryId { get; set; }
        public string ParentCategoryNameAR { get; set; }
        public string ParentCategoryNameEN { get; set; }
        public IFormFile Image { get; set; }
        public string ImageUrl { get; set; }
    }
}
