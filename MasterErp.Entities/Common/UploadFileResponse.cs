using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Entities.Common
{
    public class UploadFileResponse
    {
        public bool IsUploaded{ get; set; } = true;
        public string Message { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string FileUrl { get; set; }
        public string Extention { get; set; }
        public long? FileSize { get; set; }
    }
    public enum FileType
    {
        Image=1,
        Attachment
    }
}
