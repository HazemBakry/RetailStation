using MasterErp.Entities.Common;
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
        JournalEntryModel GetJournalEntryDetailsByID(int journalId);
        (bool result, string message) SaveNewJouranlEntry(JournalEntryModel model);
        DataTable GetDailyJournalEntriesSummary(FilterModel model);
        DataTable GetDailyJournalEntriesFilters(FilterModel model);
    }
}
