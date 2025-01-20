using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.DataImport;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Interface.Common;
using MasterErp.Interface.Purchase;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace MasterErp.API.Controllers.SystemSettings
{
    [Route("api/[controller]")]
    [ApiController]
    public class DataImportController : ControllerBase
    {
        private readonly IDataImportService _dataImportService;

        public DataImportController(IDataImportService dataImportService)
        {
            _dataImportService = dataImportService;
        }

        [HttpPost]
        [Route("GetImporters")]
        public IActionResult GetImporters(SearchFilterModel Model)
        {
            string UserId =User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

            var data = _dataImportService.GetImporters(Model);
            var result = new PagedResponseModel<ImporterDto>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = Model.PageSize,
                CurrentPage = Model.CurrentPage
            };
            return Ok(result);
        }
        [HttpGet]
        [Route("GetImporterById")]
        public IActionResult GetImporterById(int ImporterId)
        {
            string UserId =User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

            var result = _dataImportService.GetImporterById(ImporterId);
           
            return Ok(result);
        }        
        [HttpGet]
        [Route("GetImporterByName")]
        public IActionResult GetImporterByName(string ImporterName)
        {
            string UserId =User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

            var result = _dataImportService.GetImporterByName(ImporterName);
           
            return Ok(result);
        }

        [HttpPost]
        [Route("AddNewImporter")]
        public IActionResult AddNewImporter(ImporterDto model)
        {
            var result = _dataImportService.AddNewImporter(model);
            return Ok(result);
        }

        [HttpPost]
        [Route("EditImporter")]
        public IActionResult EditImporter(int ImporterId,ImporterDto model)
        {

            var result = _dataImportService.EditImporter(ImporterId,model);

            return Ok(result);
        }

        [HttpGet]
        [Route("DeleteImporter")]
        public IActionResult DeleteImporter(int ImporterId)
        {
            var result = _dataImportService.DeleteImporter(ImporterId);
            return Ok(result);
        }
        
        [HttpGet]
        [Route("ExportTemplateByImporterId")]
        public IActionResult ExportTemplateByImporterId(int ImporterId)
        {
            var result = _dataImportService.ExportTemplateByImporterId(ImporterId);
            return Ok(result);
        } 
        [HttpGet]
        [Route("ExportTemplateByImporterName")]
        public IActionResult ExportTemplateByImporterName(string ImporterName)
        {
            var result = _dataImportService.ExportTemplateByImporterName(ImporterName);
            return Ok(result);
        }
        [HttpGet]
        [Route("GetDBStoredProcedure")]
        public IActionResult  GetDBStoredProcedure(string SchemaName)
        {
            var result = _dataImportService.GetDBStoredProcedure(SchemaName);
            return Ok(result);
        }
        [HttpGet]
        [Route("GetDBTables")]
        public IActionResult GetDBTables()
        {
            var result = _dataImportService.GetDBTables();
            return Ok(result);
        }

        [HttpPost]
        [Route("ExecuteImporterById")]
        public async Task<IActionResult> ExecuteImporterById(int ImporterId, [FromForm] FileImportDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _dataImportService.ExecuteImporterById(ImporterId,model);
            return Ok(result);
        }

        [HttpPost]
        [Route("ExecuteImporterByName")]
        public async Task<IActionResult> ExecuteImporterByName(string ImporterName, [FromForm] FileImportDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _dataImportService.ExecuteImporterByName(ImporterName, model);
            return Ok(result);
        }



    }
}
