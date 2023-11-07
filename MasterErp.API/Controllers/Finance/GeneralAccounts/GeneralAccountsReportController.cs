using MasterErp.Entities.Common;
using MasterErp.Interface.Finance.GeneralAccounts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
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
        public List<SearchFilterModel> GetAccountsGeneralLedger(SearchFilterModel model)
        {
            return ReportService.GetAccountsGeneralLedger(model);
        }
    }
}
