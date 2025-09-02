using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Entities.DTOs.Shared
{
    public class AttachmentModel
    {
        public int? AttachmentId { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string FileUrl { get; set; }
        public long? FileSize { get; set; }
    }
}
