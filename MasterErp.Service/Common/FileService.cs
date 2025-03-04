using MasterErp.Entities.Common;
using MasterErp.Interface.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Service.Common
{
    public class FileService : IFileService
    {
        private readonly List<string> _imageExtensions;
        private readonly List<string> _attachmentExtensions;
        private readonly List<string> _importerExtensions;
        private readonly IConfiguration Configuration;
        private readonly string PublicPath;
        private readonly IHttpContextAccessor _httpContextAccessor;

        private const long MaxFileSize = 5 * 1024 * 1024; // 5 MB

        public FileService(IHttpContextAccessor httpContextAccessor, IConfiguration Configuration)
        {
            _imageExtensions = new List<string> { ".jpg", ".jpeg", ".png" };
            _attachmentExtensions = new List<string> { ".jpg", ".jpeg", ".png", ".pdf", ".docx", ".xls", ".doc" };
            _importerExtensions = new List<string> { ".xls", ".xlsx", ".csv" };
            _httpContextAccessor = httpContextAccessor;
            this.Configuration = Configuration;
            this.PublicPath = Configuration.GetSection("APIPath").Value;
        }

        public async Task<UploadFileResponse> UploadFileAsync(IFormFile file, string uploadDirectory, FileType fileType, List<string> allowedExtensions = null)
        {
            allowedExtensions ??= new List<string>();

            if (file == null || file.Length == 0)
            {
                return new UploadFileResponse { IsUploaded = false, Message = "No files uploaded." };
            }

            allowedExtensions = allowedExtensions.Any() ? allowedExtensions : GetAllowedExtensionsByFileType(fileType);
            string extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!IsFileExtensionSupported(extension, allowedExtensions))
            {
                return new UploadFileResponse { IsUploaded = false, Message = $"File type not allowed: {file.FileName}" };
            }

            if (file.Length > MaxFileSize)
            {
                return new UploadFileResponse { IsUploaded = false, Message = $"File size exceeded: {file.FileName}" };
            }

            string sanitizedFileName = SanitizeFileName(Path.GetFileNameWithoutExtension(file.FileName));
            string safeFileName = $"{sanitizedFileName}{extension}"; //_{Guid.NewGuid()}{extension}";
            string filePath = Path.Combine(uploadDirectory, safeFileName);
            string uploadPath = Path.Combine("wwwroot", filePath);

            try
            {
                EnsureDirectoryExists(uploadPath);

                await using var stream = new FileStream(uploadPath, FileMode.Create);
                await file.CopyToAsync(stream);

                return new UploadFileResponse
                {
                    IsUploaded = true,
                    Message = "File uploaded successfully.",
                    FileName = $"{sanitizedFileName}{extension}",//safeFileName,
                    FilePath = filePath,
                    FileSize = file.Length,
                    Extention = extension,
                    FileUrl = GetFileDownloadUrl(filePath)
                };
            }
            catch (Exception ex)
            {
                return new UploadFileResponse { IsUploaded = false, Message = $"An error occurred while uploading the file. {ex.InnerException?.Message ?? ex.Message}" };
            }
        }
        public async Task<List<UploadFileResponse>> UploadMultipleFilesAsync(IEnumerable<IFormFile> files, string uploadDirectory, FileType fileType, List<string> allowedExtensions=null)
        {
            allowedExtensions ??= new List<string>();
            var responses = new List<UploadFileResponse>();

            foreach (var file in files)
            {
                var response = await UploadFileAsync(file, uploadDirectory, fileType, allowedExtensions);
                responses.Add(response);
            }

            return responses;
        }
        public async Task<UploadFileResponse> DeleteFileAsync(string filePath)
        {
            if (string.IsNullOrEmpty(filePath))
            {
                return  new UploadFileResponse { IsUploaded = false, Message = "File path cannot be null or empty." };
            }

            try
            {
                var fullPath = Path.Combine("wwwroot", filePath);
                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                    return new UploadFileResponse { IsUploaded = true, Message = "File deleted successfully." };
                }
                else
                {
                    return new UploadFileResponse { IsUploaded = false, Message = "File not found." };
                }
            }
            catch (Exception ex)
            {
                return new UploadFileResponse { IsUploaded = false, Message = $"An error occurred while uploading the file. {ex.InnerException?.Message ?? ex.Message}" };
            }
        }
        public string GetFileDownloadUrl(string serverPath)
        {
            if (string.IsNullOrEmpty(serverPath))
                return string.Empty;

            var request = _httpContextAccessor.HttpContext.Request;
            return $"{request.Scheme}://{request.Host}/{serverPath.Replace("wwwroot/", string.Empty)}";
        }

        private List<string> GetAllowedExtensionsByFileType(FileType fileType) =>
            fileType switch
            {
                FileType.Image => _imageExtensions,
                FileType.Attachment => _attachmentExtensions,
                FileType.Importer => _importerExtensions,
                _ => new List<string>()
            };

        private static bool IsFileExtensionSupported(string extension, IEnumerable<string> allowedExtensions) =>
            allowedExtensions.Contains(extension, StringComparer.OrdinalIgnoreCase);

        private static string SanitizeFileName(string fileName) =>
            string.Concat(fileName.Split(Path.GetInvalidFileNameChars()));

        private static void EnsureDirectoryExists(string filePath)
        {
            var directory = Path.GetDirectoryName(filePath);
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }
        }
    }


    //public class FileService : IFileService
    //{
    //    private readonly List<string> ImageExtentions;
    //    private readonly List<string> AttachmentExtentions;
    //    private readonly IHttpContextAccessor _httpContextAccessor;
    //    public FileService(IHttpContextAccessor httpContextAccessor)
    //    {
    //        ImageExtentions = new List<string> { ".jpg", ".jpeg", ".png" };
    //        AttachmentExtentions = new List<string> { ".jpg", ".jpeg", ".png", ".pdf", ".docx", "xls", "doc" };
    //        _httpContextAccessor = httpContextAccessor;
    //    }
    //    public async Task<UploadFileResponse> UploadFile(IFormFile file,string uploadDirectory, FileType type,List<string> allowedExtensions)
    //    {

    //        try
    //        {
    //            if (file == null)
    //            {
    //                return new UploadFileResponse { IsUploaded = false, Message = "No files uploaded." };
    //            }

    //            // Define allowed file types and max size (in bytes)
    //            if (!allowedExtensions.Any())
    //                allowedExtensions = GetAllowedExtentionsByFileType(type);
    //            long maxFileSize = 5 * 1024 * 1024; // 5 MB

    //            var extension = Path.GetExtension(file.FileName).ToLower();

    //            if (!IsFileExtensionSupported(file.FileName, allowedExtensions))
    //            {
    //                return new UploadFileResponse { IsUploaded = false, Message = $"File type not allowed: {file.FileName}" };
    //            }

    //            if (file.Length > maxFileSize)
    //            {
    //                return new UploadFileResponse { IsUploaded = false, Message = $"File size exceeded: {file.FileName}" };
    //            }

    //            // Sanitize File Name
    //            var sanitizedFileName = Path.GetFileNameWithoutExtension(file.FileName);
    //            sanitizedFileName = string.Concat(sanitizedFileName.Split(Path.GetInvalidFileNameChars()));
    //            var safeFileName = $"{sanitizedFileName}_{Guid.NewGuid()}{extension}";

    //            // File Path 
    //            var filePath = Path.Combine(uploadDirectory, safeFileName);
    //            var uploadPath = Path.Combine("wwwroot", filePath);

    //            // Create directory if it doesn't exist
    //            var directory = Path.GetDirectoryName(uploadPath);
    //            if (!Directory.Exists(directory))
    //            {
    //                Directory.CreateDirectory(directory);
    //            }

    //            // Save the file
    //            using (var stream = new FileStream(uploadPath, FileMode.Create))
    //            {
    //                await file.CopyToAsync(stream);
    //            }

    //            return new UploadFileResponse 
    //            { 
    //                IsUploaded = true,
    //                Message = $"File uploaded" ,
    //                FileName = file.FileName,
    //                FilePath = filePath,
    //                FileSize = file.Length
    //            };

    //        }
    //        catch (Exception ex)
    //        {

    //            throw;
    //        }
    //    }

    //    public string GetFileDownloadUrl(string serverPath)
    //    {
    //        if (string.IsNullOrEmpty(serverPath))
    //            return string.Empty;

    //        var request = _httpContextAccessor.HttpContext.Request;
    //        return $"{request.Scheme}://{request.Host}/{serverPath.Replace("wwwroot/", string.Empty)}";
    //    }
    //    private List<string> GetAllowedExtentionsByFileType(FileType type)
    //    {
    //        switch (type)
    //        {   
    //            case FileType.Image:
    //                return ImageExtentions;
    //                break;
    //            case FileType.Attachment:
    //                return AttachmentExtentions;
    //                break;
    //            default:
    //                break;
    //        }
    //        return new List<string>();
    //    }

    //    private bool IsFileExtensionSupported(string fileName ,List<string> SupportedFileExtentions)
    //    {
    //        var fileExtension = Path.GetExtension(fileName);
    //        return SupportedFileExtentions.Contains(fileExtension, StringComparer.OrdinalIgnoreCase);
    //    }
    //}
}
