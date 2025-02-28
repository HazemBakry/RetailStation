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
        [Route("GetTrialBalanceReport")]
        public List<JournalEntryViewModel> GetTrialBalanceReport(SearchFilterModel model)
        {
            return ReportService.GetTrialBalanceReport(model);
        }

        #region Cost Center

        [HttpPost]
        [Route("GetCostGeneralLedger")]
        public IActionResult GetCostGeneralLedger(SearchFilterModel model)
        {
            return Ok(null);
        }


        [HttpPost]
        [Route("ExportCostGeneralLedger")]
        public IActionResult ExportCostGeneralLedger(SearchFilterModel model)
        {
            return Ok(null);
        }


        [HttpPost]
        [Route("GetCostAssistantLedger")]
        public IActionResult GetCostAssistantLedger(SearchFilterModel model)
        {
            return Ok(null);
        }


        [HttpPost]
        [Route("ExportCostAssistantLedger")]
        public IActionResult ExportCostAssistantLedger(SearchFilterModel model)
        {
            return Ok(null);
        }


        [HttpPost]
        [Route("GetCostTrialBalanceReport")]
        public IActionResult GetCostTrialBalanceReport(SearchFilterModel model)
        {
            return Ok(null);
        }


        [HttpPost]
        [Route("ExportCostTrialBalanceReport")]
        public IActionResult ExportCostTrialBalanceReport(SearchFilterModel model)
        {
            return Ok(null);
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
