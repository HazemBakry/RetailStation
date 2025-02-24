using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using MasterErp.Interface.GeneralAccounts.GeneralAccountSettings;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data;

namespace MasterErp.API.Controllers.Finance.GeneralAccounts
{
    [Route("api/[controller]")]
    [ApiController]
    public class DailyNotebookController : ControllerBase
    {
        private readonly IDailyNotebookService _dailyNotebookService;
        public DailyNotebookController(IDailyNotebookService dailyNotebookService)
        {
            _dailyNotebookService = dailyNotebookService;
        }

        [HttpPost("GetDailyNotebookData")]
        public DataTable GetDailyNotebookData(FilterModel model)
        {
            var results = _dailyNotebookService.GetDailyNotebookData(model);
            return results;
        }

        [HttpPost("AddNewDailyNotebook")]
        public ActionsResponseModel AddNewDailyNotebook(DailyNotebook Model)
        {
            var results = _dailyNotebookService.AddNewDailyNotebook(Model);
            return results;
        }

        [HttpPost("EditDailyNotebook")]
        public ActionsResponseModel EditDailyNotebook(DailyNotebook Model)
        {
            var results = _dailyNotebookService.EditDailyNotebook(Model);
            return results;
        }

        [HttpGet("DeleteDailyNotebook")]
        public ActionsResponseModel DeleteDailyNotebook(int DailyNotebookId)
        {
            var results = _dailyNotebookService.DeleteDailyNotebook(DailyNotebookId);
            return results;
        }
    }
}
