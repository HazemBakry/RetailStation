using RetailStation.Entities.Common;
using RetailStation.Entities.DTOs.Auth;
using RetailStation.Entities.DTOs.Subscription;
using RetailStation.Entities.DTOs.Website;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RetailStation.Interfaces.Subscription
{
    public interface ISubscribersService
    {

        Task<ActionsResponseModel> CreateNewSubscriber(SubscriberDto model);
        Task<ActionsResponseModel> EditSubscriber(string SubscriberId, SubscriberDto model);
        List<SubscriberDto> GetAllSubscribers_Data(SearchFilterModel Model, string SubscriberId = "");
        SubscriberDto GetSubscriberById(string SubscriberId);
        List<SubscriberApplicationDto> GetSubscriberApplications(string SubscriberId);
        ActionsResponseModel EditSubscriberApplications(string SubscriberId, List<SubscriberApplicationDto> ApplicationList);


        #region MerchantRequests
        ActionsResponseModel EditMerchantRequest(string MerchantRequestId, MerchantRequestModel model);
        ActionsResponseModel DeleteMerchantRequest(string MerchantRequestId);
        List<MerchantRequestModel> GetMerchantRequests_Data(SearchFilterModel FilterModel);
        ActionsResponseModel ApproveMerchantRequest(string MerchantRequestId, MerchantRequestModel model);
        #endregion
    }
}
