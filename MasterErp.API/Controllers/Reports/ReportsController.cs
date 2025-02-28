using MasterErp.Interface.Reports;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace MasterErp.API.Controllers.Reports
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly ITestReportService _testReportService;
        public ReportsController(ITestReportService testReportService)
        {
            _testReportService = testReportService;
        }

        [HttpGet("CreateTestReport")]
        public IActionResult CreateTestReport()
        {
            var FilePath = _testReportService.CreateTestReport();
            if (!System.IO.File.Exists(FilePath))
            {
                return null;
            }

            string fileUrl = $"{Request.Scheme}://{Request.Host}/Reports/{Path.GetFileName(FilePath)}";
            return Ok(new { FilePath = fileUrl });
        }
    }
}
