using MasterErp.Entities.Common;
using MasterErp.Entities.Models.Finance;
using MasterErp.Interface.GeneralAccounts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

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
        public List<JournalEntry> GetAccountsGeneralLedger(SearchFilterModel model)
        {
            return ReportService.GetAccountsGeneralLedger(model);
        }

        [HttpPost]
        [Route("GetAccountsAssistantLedger")]
        public DataTable GetAccountsAssistantLedger(SearchFilterModel model)
        {
            return ReportService.GetAccountsAssistantLedger(model);
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
