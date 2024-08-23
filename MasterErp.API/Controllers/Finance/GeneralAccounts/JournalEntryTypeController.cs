using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.Common;
using Microsoft.AspNetCore.Mvc;
using MasterErp.Interface.GeneralAccounts;

namespace MasterErp.API.Controllers.Finance.GeneralAccounts
{
    [Route("api/[controller]")]
    [ApiController]
    public class JournalEntryTypeController : ControllerBase
    {

        private readonly IJournalEntryTypeService _journalEntryTypeService;

        public JournalEntryTypeController(IJournalEntryTypeService journalEntryTypeService)
        {
            _journalEntryTypeService = journalEntryTypeService;
        }


        [HttpPost]
        [Route("GetJournalEntryTypesData")]
        public IActionResult GetJournalEntryTypesData(FilterModel model)
        {
            var results = _journalEntryTypeService.GetJournalEntryTypesData(model);

            return Ok(results);
        }

        [HttpPost]
        [Route("CreateNewJournalEntryType")]
        public IActionResult CreateNewJournalEntryType(JournalEntryTypeModel Model)
        {
            var results = _journalEntryTypeService.CreateNewJournalEntryType(Model);
            return Ok(results);
        }
    }
}
