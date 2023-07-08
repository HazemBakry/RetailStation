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

        [HttpGet]
        [Route("GetDailyJournalEntries")]
        public DataTable GetDailyJournalEntries(FilterModel model)
        {
            return EntryService.GetDailyJournalEntries(model);
        }

        [HttpPost]
        [Route("SaveNewJouranlEntry")]
        public (bool result, string message) SaveNewJouranlEntry(JournalEntryModel model)
        {
            return EntryService.SaveNewJouranlEntry(model);
        }
    }
}
