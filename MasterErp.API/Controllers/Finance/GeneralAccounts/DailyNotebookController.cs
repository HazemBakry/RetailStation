using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.Models.Finance;
using MasterErp.Interface.GeneralAccounts.GeneralAccountSettings;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data;
using System.Linq;

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

        [HttpPost]
        [Route("GetDailyNotebooksData")]
        public IActionResult GetDailyNotebooksData(SearchFilterModel model)
        {
            var data = _dailyNotebookService.GetDailyNotebooksData(model);
            var result = new PagedResponseModel<DailyNotebookModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpPost]
        [Route("CreateNewDailyNotebook")]
        public IActionResult CreateNewDailyNotebook(DailyNotebookModel Model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            Model.CreatedBy = UserId;
            var results = _dailyNotebookService.CreateNewDailyNotebook(Model);
            return Ok(results);
        }
        [HttpPost]
        [Route("EditDailyNotebook")]
        public IActionResult EditDailyNotebook(int DailyNotebookId, DailyNotebookModel Model)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
            Model.ModifiedBy = UserId;
            var results = _dailyNotebookService.EditDailyNotebook(DailyNotebookId, Model);
            return Ok(results);
        }
        [HttpGet]
        [Route("DeleteDailyNotebook")]
        public IActionResult DeleteDailyNotebook(int DailyNotebookId)
        {
            var results = _dailyNotebookService.DeleteDailyNotebook(DailyNotebookId);
            return Ok(results);
        }
    }
}
