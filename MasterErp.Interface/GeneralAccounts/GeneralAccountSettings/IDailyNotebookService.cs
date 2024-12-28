using MasterErp.Entities.Common;
using MasterErp.Entities.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.GeneralAccounts.GeneralAccountSettings
{
    public interface IDailyNotebookService
    {
        List<DailyNotebook> GetDailyNotebookData();
        ActionsResponseModel AddNewDailyNotebook(DailyNotebook Model);
        ActionsResponseModel EditDailyNotebook(DailyNotebook Model);
        ActionsResponseModel DeleteDailyNotebook(int DailyNotebookId);
    }
}
