using MasterErp.Entities.Common;
using MasterErp.Interface.Finance.GeneralAccounts;
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
        public DataTable GetAccountsGeneralLedger(SearchFilterModel model)
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
        public DataTable GetTrialBalanceReport(SearchFilterModel model)
        {
            return ReportService.GetTrialBalanceReport(model);
        }
    }
}
