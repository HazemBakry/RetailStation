using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using RetailStation.Entities.DTOs.Shared;
using RetailStation.Entities.Models.HR;

namespace RetailStation.Entities.DTOs.HR
{

    public class EmployeeAttachmentDto : CreatorModel
    {
        public int? EmployeeAttachmentId { get; set; }
        public List<AttachmentModel> Attachments { get; set; }
        public List<IFormFile> Files { get; set; }
        public int? EmployeeId { get; set; }
        public Employee Employee { get; set; }
    }
}
