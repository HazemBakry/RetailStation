using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.GeneralAccounts
{
    public interface IJournalEntryService
    {
        DataTable GetGeneralAccounts_Statistics();
        List<JournalEntryType> GetJournalEntryTypes();
        List<Currency> GetCurrencyList();
        int GenerateNewEntryNumber(int month, int year);
        List<JournalTemplate> GetSavedJournalTemplates();
        List<JournalTemplateDetails> GetAccountsByTemplateId(int templateId);
        JournalEntryModel GetJournalEntryDetailsById(int journalId);
        ActionsResponseModel SaveNewJournalEntry(JournalEntryModel model);
        ActionsResponseModel EditJournalEntry(int EntryId,JournalEntryModel model);
        DataTable GetDailyJournalEntriesSummary(FilterModel model);
        List<FilterModel> GetDailyJournalEntriesFilters(FilterModel model);
        bool CancelJournalEntry(List<int> JournalEntryIds);
        bool PostJournalEntry(List<int> JournalEntryIds);
        bool ReverseJournalEntry(List<int> JournalEntryIds);
        bool PrintJournalEntry(List<int> JournalEntryIds);
        //bool SavePaymentJournalEntry(PaymentReceipt Model);
        //bool SaveReceiveJournalEntry(ReceiveReceipt Model);
    }
}
