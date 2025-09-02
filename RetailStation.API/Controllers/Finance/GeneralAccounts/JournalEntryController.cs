using ICU4N.Util;
using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.GeneralAccounts;
using RetailStation.Entities.Models;
using RetailStation.Entities.Models.Finance;
using RetailStation.Interface.GeneralAccounts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace RetailStation.API.Controllers.Finance.GeneralAccounts
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

        [HttpPost]
        [Route("GetSavedJournalTemplates")]
        public IActionResult GetSavedJournalTemplates(SearchFilterModel model)
        {
            var data = EntryService.GetSavedJournalTemplates(model);

            var result = new PagedResponseModel<JournalTemplateModel>
            {
                Results = data,
                TotalCount = data.FirstOrDefault()?.TotalCount ?? 0,
                PageSize = model.PageSize,
                CurrentPage = model.CurrentPage
            };
            return Ok(result);
        }

        [HttpGet]
        [Route("GetJournalTemplateDetailsById")]
        public IActionResult GetJournalTemplateDetailsById(int templateId)
        {
            var result = EntryService.GetJournalTemplateDetailsById(templateId);
            return Ok(result);

        }

        [HttpPost]
        [Route("SaveNewJournalEntryTemplate")]
        public IActionResult SaveNewJournalEntryTemplate(JournalTemplateModel model)
        {
            var results = EntryService.SaveNewJournalEntryTemplate(model);
            return Ok(results);
        }

        [HttpPost]
        [Route("EditJournalEntryTemplate")]
        public IActionResult EditJournalEntryTemplate(int EntryId, JournalTemplateModel model)
        {
            var results = EntryService.EditJournalEntryTemplate(EntryId, model);
            return Ok(results);
        }

        [HttpGet]
        [Route("GetEntryDetailsByEntryId")]
        public JournalEntryModel GetEntryDetailsByEntryId(int EntryId)
        {
            return EntryService.GetEntryDetailsById(EntryId);
        }

        [HttpGet]
        [Route("GetEntryDetailsByReceiptId")]
        public IActionResult GetEntryDetailsByReceiptId(int ReceiptId, string ReceiptType)
        {
            var result = EntryService.GetEntryDetailsByReceiptId(ReceiptId, ReceiptType);
            return Ok(result);
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
        [Route("ExportDailyJournalEntries")]
        public IActionResult ExportDailyJournalEntries(SearchFilterModel SearchModel)
        {
            string UserName = string.Empty;
            var results = EntryService.ExportDailyJournalEntries(UserName, SearchModel);
            return Ok(results);
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
            var results = EntryService.EditJournalEntry(EntryId, model);
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
        [Route("CancelPostJournalEntry")]
        public IActionResult CancelPostJournalEntry(List<int> JournalEntryIds)
        {
            string UserId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

            return Ok(EntryService.CancelPostJournalEntry(UserId, JournalEntryIds));
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

            return Ok(EntryService.PrintJournalEntry(UserId, JournalEntryIds));
        }
    }
}
