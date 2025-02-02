using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.GeneralAccounts.GeneralAccountSettings
{
    public interface ILedgerJournalTypeService
    {
        List<LedgerJournalType> GetLedgerJournalTypeData();
        ActionsResponseModel AddNewLedgerJournalType(LedgerJournalType Model);
        ActionsResponseModel EditLedgerJournalType(LedgerJournalType Model);
        ActionsResponseModel DeleteLedgerJournalType(int Id);
    }
}
