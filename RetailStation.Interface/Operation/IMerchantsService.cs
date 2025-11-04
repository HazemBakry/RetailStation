using RetailStation.Entities.Common;
using RetailStation.Entities.Common.Finance.Purchases;
using RetailStation.Entities.DTOs.Operation;
using RetailStation.Entities.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interface.Operation
{
    public interface IMerchantsService
    {
        List<MerchantModel> GetMerchants_Data(SearchFilterModel model, int? MerchantId = null);
        MerchantModel GetMerchantDetailsById(int MerchantId);
        ActionsResponseModel AddNewMerchant(MerchantModel model);
        ActionsResponseModel EditMerchant(int MerchantId, MerchantModel model);
        ActionsResponseModel DeleteMerchant(int MerchantId);
    }
}
