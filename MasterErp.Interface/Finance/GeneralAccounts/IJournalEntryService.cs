using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.Finance.GeneralAccounts
{
    public interface IJournalEntryService
    {
        List<JournalEntryType> GetJournalEntryTypes();
        List<JournalTemplate> GetSavedJournalTemplates();
        List<JournalTemplateDetails> GetAccountsByTemplateId(int templateId);
    }
}
