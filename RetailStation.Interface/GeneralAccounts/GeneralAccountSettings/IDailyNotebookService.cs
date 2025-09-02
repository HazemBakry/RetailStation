using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Finance.GeneralAccounts;
using RetailStation.Entities.Models.Finance;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.GeneralAccounts.GeneralAccountSettings
{
    public interface IDailyNotebookService
    {
        List<DailyNotebookModel> GetDailyNotebooksData(SearchFilterModel Model);
        ActionsResponseModel CreateNewDailyNotebook(DailyNotebookModel Model);
        ActionsResponseModel EditDailyNotebook(int DailyNotebookId, DailyNotebookModel Model);
        ActionsResponseModel DeleteDailyNotebook(int DailyNotebookId);
    }
}
