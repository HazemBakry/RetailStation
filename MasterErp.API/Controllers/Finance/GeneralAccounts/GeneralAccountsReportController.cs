using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.GeneralAccounts;
using MasterErp.Entities.Models.Finance;
using MasterErp.Interface.GeneralAccounts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace MasterErp.API.Controllers.Finance.GeneralAccounts
{
    [Route("api/[controller]")]
    [ApiController]
    public class GeneralAccountsReportController : ControllerBase
    {
        private readonly IGeneralAccountsReportService ReportService;

        public GeneralAccountsReportController(IGeneralAccountsReportService ReportService)
        {
            this.ReportService = ReportService;
        }

        [HttpPost]
        [Route("GetAccountsGeneralLedger")]
        public IActionResult GetAccountsGeneralLedger(AccountsReportSearchFilterModel model)
        { 
            var data= ReportService.GetAccountsGeneralLedger(model);
            var result = new PagedResponseModel<AccountsGeneralLedgerModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }
        [HttpPost]
        [Route("ExportAccountsGeneralLedger")]
        public IActionResult ExportAccountsGeneralLedger(AccountsReportSearchFilterModel SearchModel)
        {
            string UserName = string.Empty;
            var results = ReportService.ExportAccountsGeneralLedger(UserName, SearchModel);
            return Ok(results);
        }

        [HttpPost]
        [Route("GetAccountsAssistantLedger")]
        public IActionResult GetAccountsAssistantLedger(AccountsReportSearchFilterModel model)
        {


            var data = ReportService.GetAccountsAssistantLedger(model);
            var result = new PagedResponseModel<AccountsAssistantLedgerModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }
        [HttpPost]
        [Route("ExportAccountsAssistantLedger")]
        public IActionResult ExportAccountsAssistantLedger(AccountsReportSearchFilterModel SearchModel)
        {
            string UserName = string.Empty;
            var results = ReportService.ExportAccountsAssistantLedger(UserName, SearchModel);
            return Ok(results);
        }
        [HttpPost]
        [Route("GetAccountsTrialBalanceReport")]
        public IActionResult GetAccountsTrialBalanceReport(AccountsReportSearchFilterModel model)
        {
            var data = ReportService.GetAccountsTrialBalanceReport(model);
            var result = new PagedResponseModel<AccountsTrialBalanceModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }
        [HttpPost]
        [Route("ExportAccountsTrialBalanceReport")]
        public IActionResult ExportAccountsTrialBalanceReport(AccountsReportSearchFilterModel SearchModel)
        {
            string UserName = string.Empty;
            var results = ReportService.ExportAccountsTrialBalanceReport(UserName, SearchModel);
            return Ok(results);
        }
        [HttpPost]
        [Route("GetAccountsBalanceSheetReport")]
        public IActionResult GetAccountsBalanceSheetReport(AccountsReportSearchFilterModel model)
        {
            var data = ReportService.GetAccountsBalanceSheetReport(model);
            var result = new PagedResponseModel<AccountsBalanceSheetModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }
        [HttpPost]
        [Route("ExportAccountsBalanceSheetReport")]
        public IActionResult ExportAccountsBalanceSheetReport(AccountsReportSearchFilterModel SearchModel)
        {
            string UserName = string.Empty;
            var results = ReportService.ExportAccountsBalanceSheetReport(UserName, SearchModel);
            return Ok(results);
        }

        #region Cost Center

        [HttpPost]
        [Route("GetCostGeneralLedger")]
        public IActionResult GetCostGeneralLedger(AccountsReportSearchFilterModel model)
        {
            var data = ReportService.GetCostGeneralLedger(model);
            var result = new PagedResponseModel<CostGeneralLedgerModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }
        [HttpPost]
        [Route("ExportCostGeneralLedger")]
        public IActionResult ExportCostGeneralLedger(AccountsReportSearchFilterModel SearchModel)
        {
            string UserName = string.Empty;
            var results = ReportService.ExportCostGeneralLedger(UserName, SearchModel);
            return Ok(results);
        }

      
        
        [HttpPost]
        [Route("GetCostAssistantLedger")]
        public IActionResult GetCostAssistantLedger(AccountsReportSearchFilterModel model)
        {
            var data = ReportService.GetCostAssistantLedger(model);
            var result = new PagedResponseModel<CostAssistantLedgerModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }
        [HttpPost]
        [Route("ExportCostAssistantLedger")]
        public IActionResult ExportCostAssistantLedger(AccountsReportSearchFilterModel SearchModel)
        {
            string UserName = string.Empty;
            var results = ReportService.ExportCostAssistantLedger(UserName, SearchModel);
            return Ok(results);
        }

      
        
        [HttpPost]
        [Route("GetCostTrialBalanceReport")]
        public IActionResult GetCostTrialBalanceReport(AccountsReportSearchFilterModel model)
        {
            var data = ReportService.GetCostTrialBalanceReport(model);
            var result = new PagedResponseModel<CostTrialBalanceModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }
        [HttpPost]
        [Route("ExportCostTrialBalanceReport")]
        public IActionResult ExportCostTrialBalanceReport(AccountsReportSearchFilterModel SearchModel)
        {
            string UserName = string.Empty;
            var results = ReportService.ExportCostTrialBalanceReport(UserName, SearchModel);
            return Ok(results);
        }

      

        [HttpPost]
        [Route("GetCostCenterMatrix")]
        public IActionResult GetCostCenterMatrix(SearchFilterModel model)
        {
            return Ok(null);
        }


        [HttpPost]
        [Route("ExportCostCenterMatrix")]
        public IActionResult ExportCostCenterMatrix(SearchFilterModel model)
        {
            return Ok(null);
        }



        #endregion
    }
}
