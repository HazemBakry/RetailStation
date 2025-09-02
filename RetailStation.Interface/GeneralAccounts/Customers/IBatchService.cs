using RetailStation.Entities.Common;
using RetailStation.Entities.Models.Finance;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.GeneralAccounts.Customers
{
    public interface IBatchService
    {
        DataTable GetBatchData(FilterModel model);
        ActionsResponseModel AddNewBatch(Batch Model);
        ActionsResponseModel EditBatch(Batch Model);
        ActionsResponseModel DeleteBatch(int BatchId);
    }
}
