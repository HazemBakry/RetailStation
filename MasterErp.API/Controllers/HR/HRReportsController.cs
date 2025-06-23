using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Interface.HR;
using MasterErp.Service.HR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Linq;

namespace MasterErp.API.Controllers.HR
{
    [Route("api/[controller]")]
    [ApiController]
    public class HRReportsController : ControllerBase
    {
        private readonly IHRReportsService _hrReportService;
        public HRReportsController(IHRReportsService hrReportService)
        {
           _hrReportService = hrReportService;
        }

        [HttpPost("GetPayrollReportVacations")]
        public DataTable GetPayrollReportVacations([FromBody] SearchFilterModel searchModel)
        {
            var result =_hrReportService.GetPayrollReportVacations(searchModel);
            return result;
        }

        [HttpPost("GetPayrollReportOverTime")]
        public DataTable GetPayrollReportOverTime([FromBody] SearchFilterModel searchModel)
        {
            var result =_hrReportService.GetPayrollReportOverTime(searchModel);
            return result;
        }

        [HttpPost("GetPayrollReportPenalties")]
        public DataTable GetPayrollReportPenalties([FromBody] SearchFilterModel searchModel)
        {
            var result =_hrReportService.GetPayrollReportPenalties(searchModel);
            return result;
        }

        [HttpPost("GetPayrollReportSickLeaves")]
        public DataTable GetPayrollReportSickLeaves([FromBody] SearchFilterModel searchModel)
        {
            var result =_hrReportService.GetPayrollReportSickLeaves(searchModel);
            return result;
        }

        [HttpPost("GetPayrollReportDeducts")]
        public DataTable GetPayrollReportDeducts([FromBody] SearchFilterModel searchModel)
        {
            var result =_hrReportService.GetPayrollReportDeducts(searchModel);
            return result;
        }

        [HttpPost("GetPayrollReportAdvances")]
        public DataTable GetPayrollReportAdvances([FromBody] SearchFilterModel searchModel)
        {
            var result =_hrReportService.GetPayrollReportAdvances(searchModel);
            return result;
        }

        [HttpPost("ExportPayrollReportVacations")]
        public ActionsResponseModel ExportPayrollReportVacations(SearchFilterModel model)
        {
            var result =_hrReportService.ExportPayrollReportVacations(model);
            return result;
        }

        [HttpPost("ExportPayrollReportOverTime")]
        public ActionsResponseModel ExportPayrollReportOverTime(SearchFilterModel model)
        {
            var result =_hrReportService.ExportPayrollReportOverTime(model);
            return result;
        }

        [HttpPost("ExportPayrollReportPenalties")]
        public ActionsResponseModel ExportPayrollReportPenalties(SearchFilterModel model)
        {
            var result =_hrReportService.ExportPayrollReportPenalties(model);
            return result;
        }

        [HttpPost("ExportPayrollReportSickLeaves")]
        public ActionsResponseModel ExportPayrollReportSickLeaves(SearchFilterModel model)
        {
            var result =_hrReportService.ExportPayrollReportSickLeaves(model);
            return result;
        }

        [HttpPost("ExportPayrollReportDeducts")]
        public ActionsResponseModel ExportPayrollReportDeducts(SearchFilterModel model)
        {
            var result =_hrReportService.ExportPayrollReportDeducts(model);
            return result;
        }

        [HttpPost("ExportPayrollReportAdvances")]
        public ActionsResponseModel ExportPayrollReportAdvances(SearchFilterModel model)
        {
            var result =_hrReportService.ExportPayrollReportAdvances(model);
            return result;
        }


        #region ExpireReport
        [HttpPost]
        [Route("GetEmployeesExpireReport_Data")]
        public IActionResult GetEmployeesExpireReport_Data(int ReportType,SearchFilterModel model)
        {
            var data = _hrReportService.GetEmployeesExpireReport_Data(ReportType, model);
            var result = new PagedResponseModel<EmployeeExpireReportModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }
        [HttpPost]
        [Route("GetEmployeesExpireReport_Export")]
        public IActionResult GetEmployeesExpireReport_Export(int ReportType,SearchFilterModel model)
        {
            var result = _hrReportService.GetEmployeesExpireReport_Export(ReportType,model);
          
            return Ok(result);
        }
        [HttpPost]
        [Route("GetEmployeesExpireReport_Filters")]
        public IActionResult GetEmployeesExpireReport_Filters(int ReportType,SearchFilterModel model)
        {
            var result = _hrReportService.GetEmployeesExpireReport_Filters(ReportType,model);
          
            return Ok(result);
        }
        #endregion
    }
}
