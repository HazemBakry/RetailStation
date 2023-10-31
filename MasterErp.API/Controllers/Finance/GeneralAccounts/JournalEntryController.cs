using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
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
    public class JournalEntryController : ControllerBase
    {
        private readonly IJournalEntryService EntryService;

        public JournalEntryController(IJournalEntryService _entryService)
        {
            EntryService = _entryService;
        }

        [HttpGet]
        [Route("GetJournalEntryTypes")]
        public List<JournalEntryType> GetJournalEntryTypes()
        {
            return EntryService.GetJournalEntryTypes();
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
        [Route("GetJournalEntryDetailsByID")]
        public JournalEntryModel GetJournalEntryDetailsByID(int journalId)
        {
            return EntryService.GetJournalEntryDetailsByID(journalId);
        }

        [HttpPost]
        [Route("GetDailyJournalEntriesSummary")]
        public DataTable GetDailyJournalEntriesSummary(FilterModel model)
        {
            return EntryService.GetDailyJournalEntriesSummary(model);
        }

        [HttpPost]
        [Route("GetDailyJournalEntriesFilters")]
        public List<FilterModel> GetDailyJournalEntriesFilters(FilterModel model)
        {
            return EntryService.GetDailyJournalEntriesFilters(model);
        }

        [HttpPost]
        [Route("SaveNewJouranlEntry")]
        public IActionResult SaveNewJouranlEntry(JournalEntryModel model)
        {
            var results = EntryService.SaveNewJouranlEntry(model);
            return Ok(results);
        }

        [HttpPost]
        [Route("CancelJournalEntry")]
        public bool CancelJournalEntry(List<int> JournalEntryIds)
        {
            return EntryService.CancelJournalEntry(JournalEntryIds);
        }

        [HttpPost]
        [Route("PostJournalEntry")]
        public bool PostJournalEntry(List<int> JournalEntryIds)
        {
            return EntryService.PostJournalEntry(JournalEntryIds);
        }

        [HttpPost]
        [Route("ReverseJournalEntry")]
        public bool ReverseJournalEntry(List<int> JournalEntryIds)
        {
            return EntryService.ReverseJournalEntry(JournalEntryIds);
        }

        [HttpPost]
        [Route("PrintJournalEntry")]
        public bool PrintJournalEntry(List<int> JournalEntryIds)
        {
            return EntryService.PrintJournalEntry(JournalEntryIds);
        }
    }
}
