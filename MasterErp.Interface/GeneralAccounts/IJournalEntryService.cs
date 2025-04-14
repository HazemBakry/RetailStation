using MasterErp.Entities.Common;
using MasterErp.Entities.DTOs.GeneralAccounts;
using MasterErp.Entities.Models;
using MasterErp.Entities.Models.Finance;
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
        List<Currency> GetCurrencyList();
        int GenerateNewEntryNumber(int month, int year);
        List<JournalTemplateModel> GetSavedJournalTemplates(SearchFilterModel model);
        JournalTemplateModel GetJournalTemplateDetailsById(int templateId);
        ActionsResponseModel SaveNewJournalEntryTemplate(JournalTemplateModel model);
        ActionsResponseModel EditJournalEntryTemplate(int JournalTemplateId, JournalTemplateModel model);
        JournalEntryModel GetJournalEntryDetailsById(int journalId);
        ActionsResponseModel SaveNewJournalEntry(JournalEntryModel model);
        ActionsResponseModel EditJournalEntry(int EntryId,JournalEntryModel model);
        List<JournalEntryModel> GetDailyJournalEntriesSummary(SearchFilterModel model);
        ActionsResponseModel ExportDailyJournalEntries(string UserName, SearchFilterModel SearchModel);

        List<FilterModel> GetDailyJournalEntriesFilters(SearchFilterModel model);
        ActionsResponseModel CancelJournalEntry(string UserId, List<int> JournalEntryIds);
        ActionsResponseModel PostJournalEntry(string UserId, List<int> JournalEntryIds);
        ActionsResponseModel ReverseJournalEntry(string UserId, List<int> JournalEntryIds);
        ActionsResponseModel PrintJournalEntry(string UserId, List<int> JournalEntryIds);
        //bool SavePaymentJournalEntry(PaymentReceipt Model);
        //bool SaveReceiveJournalEntry(ReceiveReceipt Model);
    }
}
