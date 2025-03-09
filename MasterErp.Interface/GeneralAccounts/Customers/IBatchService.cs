using MasterErp.Entities.Common;
using MasterErp.Entities.Models.Finance;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MasterErp.Interface.GeneralAccounts.Customers
{
    public interface IBatchService
    {
        DataTable GetBatchData(FilterModel model);
        ActionsResponseModel AddNewBatch(Batch Model);
        ActionsResponseModel EditBatch(Batch Model);
        ActionsResponseModel DeleteBatch(int BatchId);
    }
}
