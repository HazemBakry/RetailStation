using MasterErp.Entities.Common.Reports;
using MasterErp.Interface.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace MasterErp.API.Controllers.Shared
{
    [Route("api/[controller]")]
    [ApiController]
    public class CreateReportController : ControllerBase
    {
        private readonly ICreateReportService _testReportService;
        public CreateReportController(ICreateReportService testReportService)
        {
            _testReportService = testReportService;
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
    }
}
