using RetailStation.Entities.Common;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.Common
{
    public interface IFileService
    {
        Task<UploadFileResponse> UploadFileAsync(IFormFile file, string uploadDirectory, FileType fileType, List<string> allowedExtensions =null);
        Task<List<UploadFileResponse>> UploadMultipleFilesAsync(IEnumerable<IFormFile> files, string uploadDirectory, FileType fileType, List<string> allowedExtensions=null);
        Task<UploadFileResponse> DeleteFileAsync(string filePath);
        string GetFileDownloadUrl(string serverPath);
    }
}
