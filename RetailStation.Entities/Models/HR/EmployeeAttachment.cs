using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.Models.HR
{
    [Table("EmployeeAttachments", Schema = "HR")]

    public class EmployeeAttachment : CreatorModel
    {
        [Key]
        public int EmployeeAttachmentId { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string FileExtension { get; set; }
        public string FileType { get; set; }
        public long? FileSize { get; set; }
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }
    }
}
