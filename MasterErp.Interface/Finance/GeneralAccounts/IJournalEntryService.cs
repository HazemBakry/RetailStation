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
        List<Currency> GetCurrencyList();
        List<JournalTemplate> GetSavedJournalTemplates();
        List<JournalTemplateDetails> GetAccountsByTemplateId(int templateId);
        JournalEntryModel GetJournalEntryDetailsByID(int journalId);
        CreateModifyReturnsModel SaveNewJouranlEntry(JournalEntryModel model);
        DataTable GetDailyJournalEntriesSummary(FilterModel model);
        List<FilterModel> GetDailyJournalEntriesFilters(FilterModel model);
        bool CancelJournalEntry(List<int> JournalEntryIds);
        bool PostJournalEntry(List<int> JournalEntryIds);
        bool ReverseJournalEntry(List<int> JournalEntryIds);
        bool PrintJournalEntry(List<int> JournalEntryIds);
    }
}
