using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.Finance;
using MasterErp.Interface.GeneralAccounts;
using Microsoft.AspNetCore.Authorization;
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
    [Authorize]
    public class JournalEntryController : ControllerBase
    {
        private readonly IJournalEntryService EntryService;

        public JournalEntryController(IJournalEntryService _entryService)
        {
            EntryService = _entryService;
        }

        [HttpGet]
        [Route("GetGeneralAccounts_Statistics")]
        public DataTable GetGeneralAccounts_Statistics()
        {
            return EntryService.GetGeneralAccounts_Statistics();
        }

        [HttpGet]
        [Route("GetCurrencyList")]
        public List<Currency> GetCurrencyList()
        {
            return EntryService.GetCurrencyList();
        }

        [HttpGet]
        [Route("GetSavedJournalTemplates")]
        public List<JournalTemplate> GetSavedJournalTemplates()
        {
            return EntryService.GetSavedJournalTemplates();
        }

        [HttpGet]
        [Route("GetAccountsByTemplateId")]
        public List<JournalTemplateDetails> GetAccountTreeData(int templateId)
        {
            return EntryService.GetAccountsByTemplateId(templateId);
        }

        [HttpGet]
        [Route("GetJournalEntryDetailsById")]
        public JournalEntryModel GetJournalEntryDetailsById(int EntryId)
        {
            return EntryService.GetJournalEntryDetailsById(EntryId);
        }



        [HttpPost]
        [Route("GetDailyJournalEntriesSummary")]
        public IActionResult GetDailyJournalEntriesSummary(SearchFilterModel model)
        {
            var data = EntryService.GetDailyJournalEntriesSummary(model);

            var result = new PagedResponseModel<JournalEntryModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }


        [HttpPost]
        [Route("GetDailyJournalEntriesFilters")]
        public IActionResult GetDailyJournalEntriesFilters(SearchFilterModel model)
        {
            var results = EntryService.GetDailyJournalEntriesFilters(model);
            return Ok(results);
        }

        [HttpPost]
        [Route("SaveNewJournalEntry")]
        public IActionResult SaveNewJouranlEntry(JournalEntryModel model)
        {
            var results = EntryService.SaveNewJournalEntry(model);
            return Ok(results);
        }
        [HttpPost]
        [Route("EditJournalEntry")]
        public IActionResult EditJournalEntry(int EntryId, JournalEntryModel model)
        {
            var results = EntryService.EditJournalEntry(EntryId,model);
            return Ok(results);
        }

        [HttpPost]
        [Route("CancelJournalEntry")]
        public IActionResult CancelJournalEntry(List<int> JournalEntryIds)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

            return Ok(EntryService.CancelJournalEntry(UserId, JournalEntryIds));
        }

        [HttpPost]
        [Route("PostJournalEntry")]
        public IActionResult PostJournalEntry(List<int> JournalEntryIds)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

            return Ok(EntryService.PostJournalEntry(UserId, JournalEntryIds));
        }

        [HttpPost]
        [Route("ReverseJournalEntry")]
        public IActionResult ReverseJournalEntry(List<int> JournalEntryIds)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

            return Ok(EntryService.ReverseJournalEntry(UserId, JournalEntryIds));
        }

        [HttpPost]
        [Route("PrintJournalEntry")]
        public IActionResult PrintJournalEntry(List<int> JournalEntryIds)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

            return Ok(EntryService.PrintJournalEntry(UserId,JournalEntryIds));
        }
    }
}
