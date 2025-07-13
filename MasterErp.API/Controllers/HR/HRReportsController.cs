using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.HR;
using MasterErp.Interface.HR;
using MasterErp.Service.HR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data;
using System.Linq;

namespace MasterErp.API.Controllers.HR
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]

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
            var result = new PagedResponseModel<EmployeeReportModel>
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

        #region NewComerEmployeesRepor
        [HttpPost]
        [Route("GetNewComerEmployeesReport_Data")]
        public IActionResult GetNewComerEmployeesReport_Data(DateTime? FromDate, DateTime? ToDate, SearchFilterModel model)
        {
            var data = _hrReportService.GetNewComerEmployeesReport_Data(FromDate, ToDate, model);
            var result = new PagedResponseModel<EmployeeReportModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }
        [HttpPost]
        [Route("GetNewComerEmployeesReport_Export")]
        public IActionResult GetNewComerEmployeesReport_Export(DateTime? FromDate, DateTime? ToDate, SearchFilterModel model)
        {
            var result = _hrReportService.GetNewComerEmployeesReport_Export(FromDate, ToDate, model);

            return Ok(result);
        }
        [HttpPost]
        [Route("GetNewComerEmployeesReport_Filters")]
        public IActionResult GetNewComerEmployeesReport_Filters(DateTime? FromDate, DateTime? ToDate, SearchFilterModel model)
        {
            var result = _hrReportService.GetNewComerEmployeesReport_Filters(FromDate,ToDate, model);

            return Ok(result);
        }
        #endregion

        #region EmployeeSalaryAnnualIncreaseReport

        [HttpPost]
        [Route("GetEmployeeSalaryAnnualIncreaseReport_Data")]
        public IActionResult GetEmployeeSalaryAnnualIncreaseReport_Data( SearchFilterModel model)
        {
            var data = _hrReportService.GetEmployeeSalaryAnnualIncreaseReport_Data(model);
            var result = new PagedResponseModel<SalaryAnnualIncreaseModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpPost]
        [Route("GetEmployeeSalaryAnnualIncreaseReport_Export")]
        public IActionResult GetEmployeeSalaryAnnualIncreaseReport_Export( SearchFilterModel model)
        {
            var result = _hrReportService.GetEmployeeSalaryAnnualIncreaseReport_Export(model);

            return Ok(result);
        }

        [HttpPost]
        [Route("GetEmployeeSalaryAnnualIncreaseReport_Filters")]
        public IActionResult GetEmployeeSalaryAnnualIncreaseReport_Filters( SearchFilterModel model)
        {
            var result = _hrReportService.GetEmployeeSalaryAnnualIncreaseReport_Filters(model);

            return Ok(result);
        }

        #endregion

        #region Salaries Report

        [HttpPost]
        [Route("GetSalariesReport_Data")]
        public IActionResult GetSalariesReport_Data(int Month, int Year,SearchFilterModel model)
        {
            var data = _hrReportService.GetSalariesReport_Data(Month, Year, model);
            var result = new PagedResponseModel<EmployeeSalarySummaryModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpPost]
        [Route("GetSalariesReport_Export")]
        public IActionResult GetSalariesReport_Export(int Month , int Year, SearchFilterModel model)
        {
            var result = _hrReportService.GetSalariesReport_Export(Month, Year, model);

            return Ok(result);
        }

        [HttpPost]
        [Route("GetSalariesReport_Filters")]
        public IActionResult GetSalariesReport_Filters(int Month, int Year, SearchFilterModel model)
        {
            var result = _hrReportService.GetSalariesReport_Filters(Month, Year, model);

            return Ok(result);
        }

        #endregion

    }
}
