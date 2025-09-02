using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using MasterErp.Entities.DTOs.Shared;
using MasterErp.Entities.Models.HR;

namespace MasterErp.Entities.DTOs.HR
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
