using MasterErp.Entities.Models;
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
    public class JournalEntryController : ControllerBase
    {
        private readonly IJournalEntryService _entryService;

        [HttpGet]
        [Route("GetJournalEntryTypes")]
        public List<JournalEntryType> GetJournalEntryTypes()
        {
            return _entryService.GetJournalEntryTypes();
        }

        [HttpGet]
        [Route("GetSavedJournalTemplates")]
        public List<JournalTemplate> GetSavedJournalTemplates( )
        {
            return _entryService.GetSavedJournalTemplates();
        }

        [HttpGet]
        [Route("GetAccountTreeData")]
        public List<JournalTemplateDetails> GetAccountTreeData(int templateId)
        {
            return _entryService.GetAccountsByTemplateId(templateId);
        }
    }
}
