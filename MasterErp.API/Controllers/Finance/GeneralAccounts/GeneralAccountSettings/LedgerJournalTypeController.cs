using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using MasterErp.Interface.GeneralAccounts.GeneralAccountSettings;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data;

namespace MasterErp.API.Controllers.Finance.GeneralAccounts.GeneralAccountSettings
{
    [Route("api/[controller]")]
    [ApiController]
    public class LedgerJournalTypeController : ControllerBase
    {
        private readonly ILedgerJournalTypeService _ledgerJournalTypeService;
        public LedgerJournalTypeController(ILedgerJournalTypeService ledgerJournalTypeService)
        {
            _ledgerJournalTypeService = ledgerJournalTypeService;
        }

        [HttpGet("GetLedgerJournalTypeData")]
        public List<LedgerJournalType> GetLedgerJournalTypeData()
        {
            var results = _ledgerJournalTypeService.GetLedgerJournalTypeData();
            return results;
        }

        [HttpPost("AddNewLedgerJournalType")]
        public ActionsResponseModel AddNewLedgerJournalType(LedgerJournalType Model)
        {
            var results = _ledgerJournalTypeService.AddNewLedgerJournalType(Model);
            return results;
        }

        [HttpPost("EditLedgerJournalType")]
        public ActionsResponseModel EditLedgerJournalType(LedgerJournalType Model)
        {
            var results = _ledgerJournalTypeService.EditLedgerJournalType(Model);
            return results;
        }

        [HttpGet("DeleteLedgerJournalType")]
        public ActionsResponseModel DeleteLedgerJournalType(int Id)
        {
            var results = _ledgerJournalTypeService.DeleteLedgerJournalType(Id);
            return results;
        }
    }
}
