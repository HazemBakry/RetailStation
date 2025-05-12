using MasterErp.Entities.Common;
using MasterErp.Interface.HR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace MasterErp.API.Controllers.HR
{
    [Route("api/[controller]")]
    [ApiController]
    public class PayrollReportController : ControllerBase
    {
        private readonly IPayrollReportService _payrollReportService;
        public PayrollReportController(IPayrollReportService payrollReportService)
        {
            _payrollReportService = payrollReportService;
        }

        [HttpPost("GetPayrollReportVacations")]
        public DataTable GetPayrollReportVacations([FromBody] SearchFilterModel searchModel)
        {
            var result = _payrollReportService.GetPayrollReportVacations(searchModel);
            return result;
        }

        [HttpPost("GetPayrollReportOverTime")]
        public DataTable GetPayrollReportOverTime([FromBody] SearchFilterModel searchModel)
        {
            var result = _payrollReportService.GetPayrollReportOverTime(searchModel);
            return result;
        }

        [HttpPost("GetPayrollReportPenalties")]
        public DataTable GetPayrollReportPenalties([FromBody] SearchFilterModel searchModel)
        {
            var result = _payrollReportService.GetPayrollReportPenalties(searchModel);
            return result;
        }

        [HttpPost("GetPayrollReportSickLeaves")]
        public DataTable GetPayrollReportSickLeaves([FromBody] SearchFilterModel searchModel)
        {
            var result = _payrollReportService.GetPayrollReportSickLeaves(searchModel);
            return result;
        }

        [HttpPost("GetPayrollReportDeducts")]
        public DataTable GetPayrollReportDeducts([FromBody] SearchFilterModel searchModel)
        {
            var result = _payrollReportService.GetPayrollReportDeducts(searchModel);
            return result;
        }

        [HttpPost("GetPayrollReportAdvances")]
        public DataTable GetPayrollReportAdvances([FromBody] SearchFilterModel searchModel)
        {
            var result = _payrollReportService.GetPayrollReportAdvances(searchModel);
            return result;
        }

        [HttpPost("ExportPayrollReportVacations")]
        public ActionsResponseModel ExportPayrollReportVacations(SearchFilterModel model)
        {
            var result = _payrollReportService.ExportPayrollReportVacations(model);
            return result;
        }

        [HttpPost("ExportPayrollReportOverTime")]
        public ActionsResponseModel ExportPayrollReportOverTime(SearchFilterModel model)
        {
            var result = _payrollReportService.ExportPayrollReportOverTime(model);
            return result;
        }

        [HttpPost("ExportPayrollReportPenalties")]
        public ActionsResponseModel ExportPayrollReportPenalties(SearchFilterModel model)
        {
            var result = _payrollReportService.ExportPayrollReportPenalties(model);
            return result;
        }

        [HttpPost("ExportPayrollReportSickLeaves")]
        public ActionsResponseModel ExportPayrollReportSickLeaves(SearchFilterModel model)
        {
            var result = _payrollReportService.ExportPayrollReportSickLeaves(model);
            return result;
        }

        [HttpPost("ExportPayrollReportDeducts")]
        public ActionsResponseModel ExportPayrollReportDeducts(SearchFilterModel model)
        {
            var result = _payrollReportService.ExportPayrollReportDeducts(model);
            return result;
        }

        [HttpPost("ExportPayrollReportAdvances")]
        public ActionsResponseModel ExportPayrollReportAdvances(SearchFilterModel model)
        {
            var result = _payrollReportService.ExportPayrollReportAdvances(model);
            return result;
        }
    }
}
