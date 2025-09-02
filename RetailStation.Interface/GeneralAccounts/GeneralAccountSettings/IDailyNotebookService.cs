using MasterErp.Entities.Common;
using MasterErp.Entities.Common.Finance.GeneralAccounts;
using MasterErp.Entities.Models.Finance;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.GeneralAccounts.GeneralAccountSettings
{
    public interface IDailyNotebookService
    {
        List<DailyNotebookModel> GetDailyNotebooksData(SearchFilterModel Model);
        ActionsResponseModel CreateNewDailyNotebook(DailyNotebookModel Model);
        ActionsResponseModel EditDailyNotebook(int DailyNotebookId, DailyNotebookModel Model);
        ActionsResponseModel DeleteDailyNotebook(int DailyNotebookId);
    }
}
