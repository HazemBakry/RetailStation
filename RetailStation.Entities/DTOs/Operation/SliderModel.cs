using Microsoft.AspNetCore.Http;
using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Operation
{
    public class SliderModel : CreatorModel
    {
        public int? SliderId { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public IFormFile Image { get; set; }

        public string Link { get; set; }
        public string ImageURL { get; set; }
        public bool IsActive { get; set; } = true;
        public int? TotalCount { get; set; }

    }
}
