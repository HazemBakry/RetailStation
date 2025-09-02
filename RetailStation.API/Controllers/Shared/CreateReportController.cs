using RetailStation.Entities.Common.Reports;
using RetailStation.Interface.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Linq;

namespace RetailStation.API.Controllers.Shared
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

    public class CreateReportController : ControllerBase
    {
        private readonly ICreateReportService _testReportService;
        private readonly IWebHostEnvironment _environment;
        public CreateReportController(ICreateReportService testReportService, IWebHostEnvironment environment)
        {
            _testReportService = testReportService;
            _environment = environment;
        }

        [HttpPost("CreateGeneralReport")]
        public IActionResult CreateGeneralReport(SearchReportModel Model)
        {
            var FilePath = _testReportService.CreateGeneralReport(Model);
            if (!System.IO.File.Exists(FilePath))
            {
                return null;
            }

            string fileUrl = $"{Request.Scheme}://{Request.Host}/Reports/{Path.GetFileName(FilePath)}";
            return Ok(new { FilePath = fileUrl });
        }

        [HttpGet("DeleteReportPdfFile")]
        public IActionResult DeleteReportPdfFile(string FileName)
        {
            var ReportFilePaths = Directory.GetFiles(Path.Combine(_environment.WebRootPath, "Reports"));
            string FilePath = ReportFilePaths.FirstOrDefault(i => i.Contains(FileName));
            if (System.IO.File.Exists(FilePath))
            {
                System.IO.File.Delete(FilePath);
                return Ok();
            }
            return NotFound();
        }
    }
}
